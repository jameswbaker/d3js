import Tensor from './core/Tensor.js';
import DenseLayer from './layers/DenseLayer.js';
import Sigmoid from './activations/Sigmoid.js';

// Create a 3x1 input tensor (column vector) to match DenseLayer(3, 2)
const input = new Tensor([
    [4],
    [2],
    [3]
]);

// Create a Dense layer with 3 inputs and 1 output
const layer = new DenseLayer(3, 1);

// Create a Sigmoid activation
const activation = new Sigmoid();

// Forward pass
const z = layer.forward(input);
const output = activation.forward(z);

console.log("Input:", input.data);
console.log("Layer output:", z.data);
console.log("Activation output:", output.data);
