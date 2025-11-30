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

        this.layers.forEach((layer, i) => {
            const g = layer.toGraph(`layer-${i}`);
            nodes.push(...g.nodes);
            links.push(...g.links);

            if (i > 0) {
                links.push({
                    source: `layer-${i-1}`,
                    target: `layer-${i}`,
                    color: "gray"
                });
            }
        });

        return { nodes, links };
    }
}