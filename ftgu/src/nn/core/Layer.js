export default class Layer {
    forward(input) {
        throw new Error("forward() not implemented");
    }

    backward(input) {
        throw new Error("backward() not implemented");
    }

    getParams() {
        return [];
    }

    getGrads() {
        return [];
    }
}