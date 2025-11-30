import Tensor from '../core/Tensor.js'
import Layer from '../core/Layer.js'

export default class DenseLayer extends Layer {

    constructor(input_size, output_size) {
        super();

        // initialize W and b
        /* Xavier/Glorot Initialization:
            - Principle: Aims to maintain similar variance of activations across layers, 
              preventing vanishing or exploding gradients.
            - Method: Weights are drawn from a uniform or normal distribution with a 
              specific scaling factor related to the number of input and output units 
              (fan-in and fan-out).
            - Suitable for: Activation functions like sigmoid and tanh, which have 
              a zero mean.
        */
        this.W = new Tensor(
            Array(output_size).fill(0).map(() => 
                Array(input_size).fill(0).map(() => Math.random() - 0.5)
            )
        );
        this.b = new Tensor(
            Array(output_size).fill(0).map(() => [0])
        );

        // Gradients
        this.dW = Tensor.zeros([output_size, input_size]);
        this.db = Tensor.zeros([output_size, 1]);

        this.lastInput = null;
    }

    forward(input) {
        const x = input.data;  // m x 1
        const W = this.W.data;  // m x n
        const b = this.b.data;  // n x 1

        // W^T x + b
        const output = W.map((row, i) => {
            const sum = row.reduce((acc, w_ij, j) => acc + w_ij * x[j][0], 0)
            return [sum + b[i][0]];
        });

        this.lastInput = input;
        return new Tensor(output);
    }


    backward(gradOutput) {
        const x = this.lastInput.data;  // x : (input_size, 1)
        const W = this.W.data;  // W : (output_size, input_size)
        const d = gradOutput.data;  // dL/dy :(output_size, 1)

        // dL/dW = dL/dy * dy/dW = gradOutput * d/dW(sum Wx + b) = gradOutput * x^T
        this.dW = new Tensor(
            d.map((row, i) => {
                return x.map((_, j) => row[0] * x[j][0]);
            })
        );


        // dL/db = dL/dy * dy/db = gradOutput * d/db(sum Wx + b) = gradOutput * 1
        this.db = new Tensor(
            d.map((row) => [row[0]])
        )

        // dL/dx = dL/dy * dy/dx = gradOutput * d/dx(Wx+b) = W^T * gradOutput
        const dx = W[0].map((_, j) => {
            let sum = 0;
            for (let i = 0; i < W.length; i++) {
                sum += W[i][j] * d[i][0];
            }
            return [sum];
        });

        return new Tensor(dx);
    }

    getParams() {
        return [this.W, this.b];
    }

    getGrads() {
        return [this.dW, this.db];
    }

    toGraph(idPrefix = "dense") {
        const layerId = idPrefix; // use provided prefix exactly (Network expects this)
 
        const nodes = [];
        const links = [];

        const inputSize = this.W.data[0].length;
        const outputSize = this.W.data.length;

        // Layer representative node (so Network can link layers by idPrefix)
        // nodes.push({
        //     id: layerId,
        //     type: "layer",
        //     label: `Dense ${inputSize}→${outputSize}`,
        //     color: "#666"
        // });

        // Create input neuron nodes
        const inputIds = [];
        for (let i = 0; i < inputSize; i++) {
            const nid = `${layerId}:in:${i}`;
            inputIds.push(nid);
            nodes.push({
                id: nid,
                type: "input",
                layer: layerId,
                label: `in${i}`,
                color: "#1f77b4"
            });
        }

        // Create output neuron nodes
        const outputIds = [];
        for (let j = 0; j < outputSize; j++) {
            const nid = `${layerId}:out:${j}`;
            outputIds.push(nid);
            nodes.push({
                id: nid,
                type: "output",
                layer: layerId,
                label: `out${j}`,
                color: "#ff7f0e"
            });
        }

        // Create weight edges from each input neuron to each output neuron
        // include weight value for possible visual encoding
        const W = this.W.data;
        for (let j = 0; j < outputSize; j++) {
            for (let i = 0; i < inputSize; i++) {
                links.push({
                    source: inputIds[i],
                    target: outputIds[j],
                    weight: W[j][i]
                });
            }
        }

        return { nodes, links };
    }

    
}