// src/network/NeuralNetwork.js
export default class NeuralNetwork {
  constructor(layers) {
    // layers = [3, 4, 2] → 3 input, 4 hidden, 2 output
    this.layers = layers.map((size, i) => ({
      neurons: Array(size).fill(null),
      prevLayer: i > 0 ? null : undefined,
    }));
    for (let i = 1; i < this.layers.length; i++) {
      this.layers[i].prevLayer = this.layers[i - 1];
    }
  }

  exportGraph() {
    const nodes = [];
    const links = [];

    this.layers.forEach((layer, i) => {
      layer.neurons.forEach((_, j) => {
        const id = `${i}-${j}`;
        nodes.push({ id, layer: i, neuron: j, activation: Math.random() });

        if (i > 0) {
          layer.prevLayer.neurons.forEach((_, k) => {
            links.push({ source: `${i-1}-${k}`, target: id, weight: Math.random() * 2 - 1 });
          });
        }
      });
    });

    return { nodes, links };
  }
}
