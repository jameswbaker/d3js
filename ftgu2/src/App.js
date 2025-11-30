import { useState } from "react";
import Network from "./nn/core/Network";
import DenseLayer from "./nn/layers/DenseLayer";
import Graph from './components/Graph.jsx'
import Sigmoid from './nn/activations/Sigmoid.js';

function App() {

  // const [net] = useState(() => {
  //   return new Network([
  //     new DenseLayer(3, 1),
  //   ]);
  // });

  // const { nodes, links } = net.toGraph();

  const [net] = useState(() => {
    return new Network([
      new DenseLayer(3, 1),
      // new Sigmoid()
    ]);
  })

  const { nodes, links } = net.toGraph();

  // const nodes = [
  //   { id: "A", color: "steelblue" },
  //   { id: "B" },
  //   { id: "C" },
  //   { id: "D" }
  // ];

  // const links = [
  //   { source: "A", target: "B" },
  //   { source: "A", target: "C" },
  //   { source: "B", target: "D" }
  // ];

  return (
    <div className="App">
      <Graph nodes={nodes} links={links} nodeRadius={20} />
    </div>
  );
}

export default App;
