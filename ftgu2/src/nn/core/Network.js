export default class Network {
    constructor(layers = []) {
        this.layers = layers;
    }

    add(layer) {
        this.layers.push(layer);
    }

    forward(input) {
        let out = input;
        for (const layer of this.layers) {
            out = layer.forward(out);
        }
        return out;
    }

    backward(grad) {
        let g = grad;
        for (i = this.layers.length - 1; i >= 0; i--) {
            layer = this.layers[i];
            g = layer.backward(g);
        }
    }

    getParams() {
        return this.layers.flatMap(l => l.getParams());
    }

    getGrads() {
        return this.layers.flatMap(l => l.getGrads());
    }

    exportGraph() {
        const nodes = [];
        const links = [];

        this.layers.forEach((layer, layerIndex) => {
            if (layer.lastOutput) {
                layer.lastOutput.forEach((activation, neuronIndex) => {
                    nodes.push({
                        id: `L${layerIndex}N${neuronIndex}`,
                        layer: layerIndex,
                        neuron: neuronIndex,
                        activation
                    });
                });
                if (layer.W) {
                    const prevLayerSize = layer.W[0].length;
                    const currLayerSize = layer.W.length;

                    for (let i = 0; i < currLayerSize; i++) {
                        for (let j = 0; j < prevLayerSize; j++) {
                            links.push({
                            source: `L${layerIndex - 1}N${j}`,
                            target: `L${layerIndex}N${i}`,
                            weight: layer.W[i][j]
                            });
                        }
                    }
                }
            }
        });

        return { nodes, links };
    }
}