export default class Tensor {

    constructor(data) {
        this.data = data; // array
    }

    static zeros(shape) {
        const [rows, cols] = shape;
        const data = Array(rows).fill(0).map(() => Array(cols).fill(0));
        return new Tensor(data);
    }

}