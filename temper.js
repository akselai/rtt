function setup() {
    let x = new BigNumber('10000000000000000');
    let y = new BigNumber('90071992547409910');
    console.log(listSmooth([3, 5, 7], x, y));
}

function draw() {
      
}

function gcd(a, b) {
    console.log(a.toString() + " " + b.toString())
    return b.isZero() ? a : gcd(b, a.modulo(b));
}

function primeFactors(n) {
    let factors = [];
    let divisor = 2;

    while (n.isGreaterThanOrEqualTo(2)) {
        if (n.mod(divisor).isZero()) {
            factors.push(divisor);
            n = n.div(divisor);
        } else {
            divisor++;
        }
    }
    return factors;
}

const firstHundredPrimes =
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
        31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
        73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
        127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
        179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
        233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
        283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
        353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
        419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541];

function nthPrime(n) {
    if (n <= 100) return firstHundredPrimes[n - 1];
    let counter = 0;
    if (n === 1) return 2;
    for (let i = 3; true; i += 2) {
        if (primeFactors(i).length === 1) {
            counter++;
            if (counter === (n - 1)) return i;
        }
    }
}

function listSmooth(primes, lowest, highest) {
    let __l = log(lowest.toNumber());
    let __h = log(highest.toNumber());
    switch (primes.length) {
        case 3:
            let p1 = primes[0];
            let p2 = primes[1];
            let p3 = primes[2];
            
            let bp1 = BigNumber(p1);
            let bp2 = BigNumber(p2);
            let bp3 = BigNumber(p3);
            
            let x11 = ceil(__l / log(p1));
            let x12 = ceil(__l / log(p2));
            let lower = [[]];
            for (let i = 0; i <= x11; i++) {
                let lar = [];
                for (let j = 0; j <= x12; j++) {
                    lar[j] = ceil((__l - i * log(p1) - j * log(p2)) / log(p3));
                }
                lower[i] = lar;
            }
            let x21 = floor(__h / log(p1));
            let x22 = floor(__h / log(p2));
            let higher = [[]];
            for (let i = 0; i <= x21; i++) {
                let lar = [];
                for (let j = 0; j <= x22; j++) {
                    lar[j] = floor((__h - i * log(p1) - j * log(p2)) / log(p3));
                }
                higher[i] = lar;
            }
            let result = [];
            for (let i = 0; i <= x21; i++) {
                for (let j = 0; j <= x22; j++) {
                    let k = higher[i][j];
                    // k >= (lower[i] == undefined || lower[i][j] <= 0 ? 0 : lower[i][j])
                    if (lower[i] === undefined) {
                        lower[i] = [];
                    }
                    if (lower[i][j] === undefined) {
                        lower[i][j] = 0;
                    }
                    while (k >= 0) {
                        result[result.length] = bp1.pow(i).times(bp2.pow(j)).times(bp3.pow(k));
                        k--;
                    }
                }
            }
            return result.sort((a, b) => a.isGreaterThan(b));
        default:
            return;
    }
}