import Tensor from '../core/Tensor.js'
import Activation from './Activation.js'

export default class Sigmoid extends Activation {

    // input x → sigmoid → output y → loss
    /*
    loss gradient dOut
        ↓
    multiply by derivative of sigmoid
            ↓
    gives gradient w.r.t input
    */

    // Forward function for Sigmoid activation
    // σ(x) = 1 / (1 + e^(-x))
    // inputs: 
    //  - input: Tensor, size (m, n)
    // output: Tensor, size (m, n)
    forward(input) {
        const output = input.data.map(x => 
            [1 / (1 + Math.exp(-x))]
        );

        // Store lastInput and lastOutput
        this.lastInput = input;
        this.lastOutput = new Tensor(output);

        return this.lastOutput;
    }

    // Backward function for Sigmoid activation
    // Derivative: 
    //      σ′(x) = σ(x)(1−σ(x))
    //       "how sensitive the output of this layer is to its input"
    // multiplies gradient of the loss wrt this layer's output by the local derivative 
    //          dL/dy * σ′(x)
    // inputs: 
    //  - gradOutput: Tensor, size (m, n)
    //          "gradient of the loss with respect to this layer's output"
    //          dL/dy
    //          "how sensitive the loss is to the output of this layer"
    // output: Tensor, size (m, n)
    //          dL/dx
    //          "how sensitive the loss is to this layer's input"
    backward(gradOutput) {
        // gradOutput = dL/dy
        // lastOutput = σ(x)

        // return dL/dy * σ′(x)
        
        const gradInputData = this.lastOutput.data.map((row, i) => {
            row.map((y, j) => {
                // take derivative of lastOutput[i][j]
                const sigmoidGrad = y * (1 - y);
                return gradOutputData[i][j] * sigmoidGrad;
            })
        });

        return new Tensor(gradInputData)
    }
}