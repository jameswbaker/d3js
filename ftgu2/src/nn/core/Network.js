export default class Network {
    constructor(layers = []) {
        this.layers = layers;
        this.curr_pos = 0;
        this.lastOutput = undefined;
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

    step_forward(input) {
        if (typeof input !== 'undefined') {
            this.lastOutput = input;
        }
        if (this.curr_pos >= this.layers.length) {
            return null;
        }
        const layer = this.layers[this.curr_pos];
        const out = layer.forward(this.lastOutput);
        this.lastOutput = out;
        this.curr_pos += 1;
        return out;
    }

    reset(pos = 0, clearOutput = true) {
        this.curr_pos = pos;
        if (clearOutput) this.lastOutput = undefined;
    }

    currentLayer() {
        return {
            index: this.curr_pos,
            layer: this.layers[this.curr_pos] || null
        };
    }

    toGraph() {
        const nodes = [];
        const links = [];

        let prevOutputIds = null;

        this.layers.forEach((layer, i) => {
            const idPrefix = `layer-${i}`;
            // Layer.toGraph now accepts an options object and returns { nodes, links, outputIds }
            const g = layer.toGraph({ idPrefix, inputIds: prevOutputIds });
            nodes.push(...g.nodes);
            links.push(...g.links);

            // next layer should receive these output ids as its inputIds
            prevOutputIds = g.outputIds;
        });

        return { nodes, links };
    }
}