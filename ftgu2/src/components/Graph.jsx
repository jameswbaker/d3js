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
    const nodeGroup = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5);

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

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    nodeElements.call(drag());

    function ticked() {
      linkElements
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeElements
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    function drag() {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Cleanup on unmount
    return () => simulation.stop();
  }, [nodes, links, nodeRadius]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100vh", display: "block", background: "#f9f9f9" }}
    />
  );
};

export default Graph;
