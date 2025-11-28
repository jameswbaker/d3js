import Layer from '../core/Layer.js';

export default class Dense extends Layer {
    constructor(inputSize, outputSize) {
        /* output[i] = Σ_j  W[i][j] * input[j]  +  b[i]
            - W is shaped (outDim × inDim)
            - input is length inDim
            - output is length outDim
        */
        super();

        // He initialization
        this.W = Array(outputSize)
            .fill(0)
            .map(() =>
                Array(inputSize)
                    .fill(0)
                    .map(() => Math.random() * Math.sqrt(2 / inputSize))
            );
        
        this.b = Array(outputSize).fill(0);

        this.lastInput = null;
        this.dW = null;
        this.db = null;
    }

    forward(input) {
        this.lastInput = input;
        const output = this._matVec(this.W, input).map((x,i) => x + this.b[i]);
        this.lastOutput = output;
        return output;
    }

    backward(gradOutput) {
        const input = this.lastInput;

        /*
        output[i] = Σ_j W[i][j] * input[j] + b[i]
        
        So:
        ∂output[i]/∂W[i][j] = input[j]
        
        By chain rule:
        ∂Loss/∂W[i][j] = ∂Loss/∂output[i] * input[j]
                        = gradOutput[i] * input[j]
        
        So dW is outer product:
        dW = gradOutput (column)  ×  input (row)
        */
        this.dW = this.W.map((row, i) =>
            row.map((_, j) => gradOutput[i] * input[j])
        );

        /*
        output[i] = Σ_j W[i][j] * input[j] + b[i]
        ∂output[i]/∂b[i] = 1
        ∂Loss/∂b[i] = ∂Loss/∂output[i] * ∂output[i]/∂b[i]
        ∂Loss/∂b[i] = ∂Loss/∂output[i] * 1 = gradOutput[i]
        */
        this.db = gradOutput.slice();

        // Compute gradient to propagate backwards
        /*
        output[i] = Σ_j W[i][j] * input[j] + b[i]
        ∂output[i]/∂input[j] = W[i][j]
        ∂Loss/∂input[j] 
            = Σ_i ( ∂Loss/∂output[i] * ∂output[i]/∂input[j] )
            = Σ_i ( gradOutput[i] * W[i][j] )
        gradInput = W^T * gradOutput
        */
        const gradInput = Array(input.length).fill(0);
        for (let i = 0; i < this.W.length; i++) {
            for (let j = 0; j < this.W[i].length; j++) {
                gradInput[j] += this.W[i][j] * gradOutput[i];
            }
        }

        return gradInput;
    }

    _matVec(mat, vec) {
        return mat.map(row => 
            row.reduce((sum, w, i) => sum + w * vec[i], 0)
        );
    }

    getParams() { return [this.W, this.b] }
    getGrads() { return [this.dW, this.db] }

}