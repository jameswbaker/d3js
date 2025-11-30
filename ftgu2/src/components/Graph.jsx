// Graph.jsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Graph = ({ nodes = [], links = [], nodeRadius = 12 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove(); // clean previous runs

    const g = svg.append("g");

    // Groups for links and nodes
    const linkGroup = g.append("g").attr("stroke", "#999");
    const nodeGroup = g.append("g").attr("stroke", "#000000ff").attr("stroke-width", 1.5);

    const linkElements = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const nodeElements = nodeGroup
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", d => d.color || "steelblue");

    // Build list of layer ids (use node.layer when available)
    const layerIds = Array.from(new Set(nodes.map(n => n.layer || n.id)));
    const layerIndex = Object.fromEntries(layerIds.map((id, i) => [id, i]));

    const columnWidth = Math.max(300, width / Math.max(1, layerIds.length)); // column spacing
    const centerXForLayer = (id) => (layerIndex[id] + 0.5) * columnWidth;

    // For each layer compute two sub-columns: 'in' and 'out'
    const subOffset = Math.min(80, columnWidth * 0.38); // horizontal offset for in/out within layer
    const layerX = {};
    layerIds.forEach(id => {
      const cx = centerXForLayer(id);
      layerX[id] = {
        in: cx - subOffset,
        out: cx + subOffset
      };
    });

    // Group nodes by (layer, role) so we can assign vertical slots independently
    const nodesByLayerRole = {};
    nodes.forEach(n => {
      const lid = n.layer || n.id;
      const role = (n.type === "output") ? "out" : "in";
      const key = `${lid}::${role}`;
      if (!nodesByLayerRole[key]) nodesByLayerRole[key] = [];
      nodesByLayerRole[key].push(n);
    });

    // Compute vertical target (y) for each node based on its slot inside layer+role
    const targetY = {};
    Object.entries(nodesByLayerRole).forEach(([key, arr]) => {
      // leave some padding top/bottom
      const available = Math.max(60, height - 120);
      const gap = available / Math.max(1, arr.length + 1);
      arr.forEach((node, idx) => {
        targetY[node.id] = 60 + (idx + 1) * gap;
      });
    });

    // Simulation with lateral column/sub-column x force and per-node vertical targets
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(220))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      // x force: choose in/out sub-column within the layer
      .force("x", d3.forceX(d => {
        const lid = d.layer || d.id;
        const role = (d.type === "output") ? "out" : "in";
        return (layerX[lid] && layerX[lid][role]) || width / 2;
      }).strength(0.5))
      // y force: pull each node toward its vertical slot (per layer+role)
      .force("y", d3.forceY(d => targetY[d.id] || height / 2).strength(0.9))
      .force("collide", d3.forceCollide(nodeRadius + 6))
      .on("tick", () => {
        linkElements
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        nodeElements
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

    // drag behavior
    nodeElements.call(d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
    );

    // cleanup on unmount
    return () => {
      simulation.stop();
    };
  }, [nodes, links, nodeRadius]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100vh", display: "block", background: "#f9f9f9" }}
    />
  );
};

export default Graph;
