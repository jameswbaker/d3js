import React, { useRef, useEffect } from "react";
import { renderNetworkGraph } from "../visualizer/renderer";

export default function NetworkVisualizer({ network }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (network && svgRef.current) {
      const graphData = network.exportGraph();
      renderNetworkGraph(svgRef.current, graphData);
    }
  }, [network]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
}
