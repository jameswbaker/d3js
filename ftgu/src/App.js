// src/App.js
import React, { useState } from "react";
import NetworkVisualizer from "./components/NetworkVisualizer";
import NeuralNetwork from "./network/NeuralNetwork";

function App() {
  const [network] = useState(() => new NeuralNetwork([3, 4, 2]));

  return (
    <div>
      <h1>Neural Network Visualizer</h1>
      <NetworkVisualizer network={network} />
    </div>
  );
}


export default App;