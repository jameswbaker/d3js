import Tensor from './core/Tensor.js';
import DenseLayer from './layers/DenseLayer.js';
import Sigmoid from './activations/Sigmoid.js';
import Network from './core/Network.js'

// Create a 3x1 input tensor (column vector) to match DenseLayer(3, 2)
const input = new Tensor([
    [4],
    [2],
    [3]
]);

// Create a Dense layer with 3 inputs and 1 output
// const layer = new DenseLayer(3, 1);

// Create a Sigmoid activation
// const activation = new Sigmoid();

// Forward pass
// const z = layer.forward(input);
// const output = activation.forward(z);

// console.log("Before update:");
// console.log("Layer output (z):", z.data);
// console.log("Activation output (y):", output.data);

const net = new Network([
    new DenseLayer(3, 1),
    new Sigmoid()
])

// Forward pass
const z2 = net.step_forward(input);
const output2 = net.step_forward(z);

// const output = net.forward(input);

console.log("Before update:");
console.log("Layer output (z):", z2.data);
console.log("Activation output (y):", output2.data);