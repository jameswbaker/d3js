export default class SGD {
    constructor(lr = 0.01) {
        this.lr = lr;
    }

    step(params, grads) {
        for (let k = 0; k < params.length; k++) {
            const p = params[k];
            const g = grads[k];

            if (Array.isArray(p[0])) {
                // matrix
                for (let i = 0; i < p.length; i++) {
                    for (let j = 0; j < p[i].length; j++) {
                        p[i][j] -= this.lr * g[i][j];
                    }
                }
            } else {
                for (let i = 0; i < p.length; i++) {
                    p[i] -= this.lr * g[i];
                }
            }
        }
    }
}