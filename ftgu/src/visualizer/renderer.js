// src/visualizer/renderer.js
import * as d3 from "d3";

// Color scale for activations
const activationColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["#eee", "#ff4136"]); // white → red

// Stroke width for weights
const weightScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([0.5, 3]);

export function renderNetworkGraph(svgElement, graphData) {
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove(); // clear previous graph

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const layers = d3.group(graphData.nodes, d => d.layer);
  const layerCount = layers.size || 1;

  // Compute node positions
  const layerSpacing = width / (layerCount + 1);

  const nodePositions = {};
  layers.forEach((nodes, layerIndex) => {
    const neuronCount = nodes.length || 1;
    const neuronSpacing = height / (neuronCount + 1);

    nodes.forEach((node, i) => {
      nodePositions[node.id] = {
        x: layerSpacing * (layerIndex + 1),
        y: neuronSpacing * (i + 1)
      };
    });
  });

  // Draw edges (weights) — use stable key for links
  svg.selectAll("line")
    .data(graphData.links || [], d => `${d.source}-${d.target}`)
    .join("line")
    .attr("x1", d => nodePositions[d.source]?.x ?? 0)
    .attr("y1", d => nodePositions[d.source]?.y ?? 0)
    .attr("x2", d => nodePositions[d.target]?.x ?? 0)
    .attr("y2", d => nodePositions[d.target]?.y ?? 0)
    .attr("stroke", d => (typeof d.weight === "number" ? (d.weight >= 0 ? "#0074D9" : "#FF4136") : "#999"))
    .attr("stroke-width", d => (typeof d.weight === "number" ? weightScale(d.weight) : 1))
    .attr("opacity", 0.6);

  // Draw nodes (neurons) — use stable key for nodes
  const nodeSel = svg.selectAll("circle")
    .data(graphData.nodes || [], d => d.id)
    .join("circle")
    .attr("data-id", d => d.id)
    .attr("cx", d => nodePositions[d.id]?.x ?? 0)
    .attr("cy", d => nodePositions[d.id]?.y ?? 0)
    .attr("r", 15)
    .attr("fill", d => activationColor(Number(d.activation ?? 0)))
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5)
    .style("cursor", "grab");

  // Optional: node labels (activation value) — stable key and set text here
  const labelSel = svg.selectAll("text")
    .data(graphData.nodes || [], d => d.id)
    .join("text")
    .attr("data-id", d => d.id)
    .attr("x", d => nodePositions[d.id]?.x ?? 0)
    .attr("y", d => (nodePositions[d.id]?.y ?? 0) + 5)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .text(d => {
      const a = d.activation;
      return typeof a === "number" ? a.toFixed(2) : "";
    });

  // ensure activation is available on nodePositions so drag can re-use it
  // (this was already set earlier when computing positions; keep activation there)
  // Add drag behaviour mirroring graph.html semantics but also preserve label text
  const formatActivation = d => {
    const a = d.activation ?? nodePositions[d.id]?.activation;
    return typeof a === "number" ? a.toFixed(2) : "";
  };

  const dragBehavior = d3.drag()
    .on("start", function (event, d) {
      d3.select(this).raise().style("cursor", "grabbing");
      // optional: create fx/fy like force drag semantics (if integrating with a simulation)
      d.fx = nodePositions[d.id].x;
      d.fy = nodePositions[d.id].y;
    })
    .on("drag", function (event, d) {
      nodePositions[d.id].x = event.x;
      nodePositions[d.id].y = event.y;

      // update this node's circle and label position and preserve label text
      nodeSel.filter(n => n.id === d.id)
        .attr("cx", event.x)
        .attr("cy", event.y);

      labelSel.filter(n => n.id === d.id)
        .attr("x", event.x)
        .attr("y", event.y + 5)
        .text(formatActivation(d)); // keep text from being wiped

      // update all links
      svg.selectAll("line")
        .attr("x1", l => nodePositions[l.source]?.x ?? 0)
        .attr("y1", l => nodePositions[l.source]?.y ?? 0)
        .attr("x2", l => nodePositions[l.target]?.x ?? 0)
        .attr("y2", l => nodePositions[l.target]?.y ?? 0);
    })
    .on("end", function (event, d) {
      d3.select(this).style("cursor", "grab");
      // clear fx/fy if you want the node to be free again
      delete d.fx;
      delete d.fy;
    });

  // apply drag to circles
  nodeSel.call(dragBehavior);
}