class Interval {
    constructor(expression, subgroup) {
        if (Array.isArray(expression)) {
            this.monzo = expression;
            this.subgroup = subgroup;
        } else if (expression.indexOf('/') > -1) {
            let ator = expression.split("/");
            let n = primeFactors(ator[0]); // numerator
            let d = primeFactors(ator[1]); // denominator
            this.subgroup = removeDuplicates(n.concat(d)).sort((a, b) => a - b);
            this.monzo = [];
            for (let i = 0; i < this.subgroup.length; i++) {
                this.monzo[i] = 0;
            }
            for (let i = 0; i < n.length; i++) {
                this.monzo[this.subgroup.indexOf(n[i])]++;
            }
            for (let i = 0; i < d.length; i++) {
                this.monzo[this.subgroup.indexOf(d[i])]--;
            }
        } else if (this.monzo.charAt(0) === "[" && this.monzo.charAt(this.monzo.length-1) === ">") {
            this.monzo = this.monzo.slice(1, this.monzo.length - 1).split(" ");
            this.subgroup = subgroup;
        }
    }

    normalize() {
        let subgroup = removeDuplicates(this.subgroup).sort((a, b) => a - b);
        let monzo = [];
        for (let i = 0; i < subgroup.length; i++) {
            monzo[i] = 0;
        }
        for (let i = 0; i < this.monzo.length; i++) {
            monzo[subgroup.indexOf(this.subgroup[i])] += this.monzo[i];
        }
        this.monzo = monzo;
        this.subgroup = subgroup;
    }

    add(x) {
        let a = new Interval(this.monzo.concat(x.monzo), this.subgroup.concat(x.subgroup));
        return a.normalize();
    }

    value() {
        let r = 0;
        for (let i = 0; i < this.monzo.length; i++) {
            r += this.monzo[i] * log(this.subgroup[i]);
        }
        return exp(r);
    }
}
