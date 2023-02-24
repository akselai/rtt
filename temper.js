let canvas;
let mainFont;

let keyWidth = 50;

function setup() {
    canvas = createCanvas(1200, 600);
    
    mainFont = loadFont("data/roboto_regular.ttf");
    stylizeCanvas();
    textFont(mainFont);

    let x = new Decimal('1');
    let y = new Decimal('10');
}

function stylizeCanvas() {
    canvas.style('margin', '20px auto');
    canvas.style('display', 'block');
    canvas.style('border-radius', '8px');
}

function draw() {
    background(255);
    fill(0);
    drawKeys();
}

function drawKeys() {
    stroke(0);
    fill(255);
    for (let i = 0; i < 20; i++) {
        rect(30 + keyWidth * i, 375, keyWidth, 160);
    }
}

let osc;
let freq = [1100/10, 1100/9, 1100/8, 1100/7, 1100/6, 1100/5, 1100/4, 1100/3];
function mouseClicked() {
    for (let i = 0; i < 8; i++) {
        if(insideRect(30 + keyWidth * i, 375, 30 + keyWidth + keyWidth * i, 375 + 160)) {
            playNote(freq[i]);
        }
    }
}
function keyPressed() {
    switch (key) {
        case 'z': playNote(freq[0]); break;
        case 'x': playNote(freq[1]); break;
        case 'c': playNote(freq[2]); break;
        case 'v': playNote(freq[3]); break;
        case 'b': playNote(freq[4]); break;
        case 'n': playNote(freq[5]); break;
        case 'm': playNote(freq[6]); break;
        case ',': playNote(freq[7]); break;
        default: ;
    }
}
// keyReleased????
function lightUp() {
    // sorry cannot do this
}
function playNote(freq_) {
    osc = new p5.Oscillator('sawtooth');
        osc.freq(freq_, 0);
        osc.amp(5e-2, 0);
        osc.start();
        osc.amp(0, 0.5);
}

function insideRect(a, b, c, d) {
    return mouseX >= a && mouseY >= b && mouseX <= c && mouseY <= d;
}

function gcd(a, b) {
    console.log(a.toString() + " " + b.toString())
    return b.isZero() ? a : gcd(b, a.modulo(b));
}

function primeFactors(n) {
    let factors = [];
    let divisor = 2;

    while (n.greaterThanOrEqualTo(2)) {
        if (n.mod(divisor).isZero()) {
            factors.push(divisor);
            n = n.div(divisor);
        } else {
            divisor++;
        }
    }
    return factors;
}

function mapInteger(n, subgroup, mapping) {
    const factors = primeFactors(n);
    let m = 1;
    for (let i = 0; i < factors.length; i++) {
        const f = factors[i];
        const a = subgroup.indexOf(f);
        // console.log(a); // stop it's making everything lag
        if (a !== -1) {
            m = m.mul(mapping[a]);
        } else {
            m = m.mul(factors[i]);
        }
    }
    return m;
}

function listSmooth(primes, lowest, highest) {
    let __l = lowest.ln();
    let __h = highest.ln();
    switch (primes.length) {
        case 3:
            let p1 = primes[0];
            let p2 = primes[1];
            let p3 = primes[2];

            let bp1 = Decimal(p1);
            let bp2 = Decimal(p2);
            let bp3 = Decimal(p3);

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
                        result[result.length] = bp1.pow(i).mul(bp2.pow(j)).mul(bp3.pow(k));
                        k--;
                    }
                }
            }
            return result.sort((a, b) => a.greaterThan(b));
        default:
            return;
    }
}