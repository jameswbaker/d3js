import Activation from "./Activation.js";

export default class ReLU extends Activation {
  forward(input) {
    this.lastInput = input;
    return input.map(x => Math.max(0, x));
  }

  backward(gradOutput) {
    return this.lastInput.map((x, i) => (x > 0 ? gradOutput[i] : 0));
  }
}
