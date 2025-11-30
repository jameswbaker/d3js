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
        // calls exportNode
    }
}