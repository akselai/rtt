let canvas;

const subgroup = [2, 3, 5];
const mapping = [2, 3, 5];
const subgroupDotPos = [];
let whichDot = -1;
let whichDotIndex = -1;

let xShift = -20;
let xScale = 50;

const lineYPos = 100;
const lineHeight = 20; // line vertical padding

let mainFont;
let smoothNum;

function setup() {
    canvas = createCanvas(800, 600);
    stylizeCanvas();
    colorMode(HSB, 255);
    mainFont = loadFont("data/roboto_regular.ttf");
    textFont(mainFont);
    smoothNum = listSmooth(subgroup, 1, 32);
}

function stylizeCanvas() {
    canvas.style('margin', '20px auto');
    canvas.style('display', 'block');
    canvas.style('border-radius', '8px');
}

function draw() {
    background(255);
    drawLine();
    drawDots();
    drawKeys();
}

function drawDots() {
    for (let i = 0; i < mapping.length; i++) {
        subgroupDotPos[i] = xScale * mapping[i] - xShift;
    }
    for (let i = 0; i <= smoothNum.length; i++) {
        fill(0);
        noStroke();
        text(smoothNum[i], xScale * mapInteger(smoothNum[i]) - xShift, 80);
        stroke(0);
        fill(((smoothNum[i] * 17) % 64) / 64 * 255, 255, 255);
        if (whichDot !== smoothNum[i]) {
            fill(255);
        }
        circle(xScale * mapInteger(smoothNum[i]) - xShift, 100, 10);
    }
}

function drawLine() {
    line(0, lineYPos, 800, 100);
    textAlign(CENTER);
    const magnify = pow(10, round(log(xScale) / log(10)) - 1);

    for (let i = round(xShift / xScale * magnify) / magnify;
         i <= round((800 + xShift) / xScale * magnify) / magnify;
         i += 1/magnify) {
        stroke(141, 255, 255, 180);
        if (round(i * magnify) % 10 === 0) {
            line(xScale * i - xShift, 100, xScale * i - xShift, 130);
            fill(141, 255, 255, 180);
            noStroke();
            text(round(i * magnify) / magnify, xScale * i - xShift, 150);
        } else {
            line(xScale * i - xShift, 100, xScale * i - xShift, 115);
        }
    }
}

function drawKeys() {
    stroke(0);
    fill(255);
    for (let i = 0; i < 20; i++) {
        rect(30 + 40 * i, 250, 40, 160);
    }
}

function mapInterval(x) {
    let e = x.expression;
    let s = x.subgroup;
    let r = 0;
    for (let i = 0; i < s.length; i++) {
        r += e[i] * log(s[i]);
    }
    return exp(r);
}

function mapInteger(n) {
    const factors = primeFactors(n);
    let m = 1;
    for (let i = 0; i < factors.length; i++) {
        const f = factors[i];
        const a = subgroup.indexOf(f);
        // console.log(a); // stop it's making everything lag
        if (a !== -1) {
            m *= mapping[a];
        } else {
            m *= factors[i]
        }
    }
    return m;
}

function listSmooth(primes, lowest, highest) {
    switch (primes.length) {
        case 3:
            let p1 = primes[0];
            let p2 = primes[1];
            let p3 = primes[2];
            let x11 = ceil(log(lowest) / log(p1));
            let x12 = ceil(log(lowest) / log(p2));
            let lower = [[]];
            for (let i = 0; i <= x11; i++) {
                let lar = [];
                for (let j = 0; j <= x12; j++) {
                    lar[j] = ceil((log(lowest) - i * log(p1) - j * log(p2)) / log(p3));
                }
                lower[i] = lar;
            }
            let x21 = floor(log(highest) / log(p1));
            let x22 = floor(log(highest) / log(p2));
            let higher = [[]];
            for (let i = 0; i <= x21; i++) {
                let lar = [];
                for (let j = 0; j <= x22; j++) {
                    lar[j] = floor((log(highest) - i * log(p1) - j * log(p2)) / log(p3));
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
                        result[result.length] = pow(p1, i) * pow(p2, j) * pow(p3, k);
                        k--;
                    }
                }
            }
            return result.sort((a, b) => a - b);
        default:
            return;
    }
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

function primeFactors(n) {
    let factors = [];
    let divisor = 2;

    while (n >= 2) {
        if (n % divisor === 0) {
            factors.push(divisor);
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    return factors;
}

/* Function to calculate (base^exponent)%modulus */
function modularPow(base, exponent, modulus) {
    let result = 1;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

function PollardRho(n) {
    if (n === 1) {
        return n;
    }
    if (n % 2 === 0) {
        return 2;
    }

    let x = (Math.floor(Math.random() * (-n + 1)));
    let y = x;

    let c = (Math.floor(Math.random() * (-n + 1)));

    let d = 1;
    while (d === 1) {
        x = (modularPow(x, 2, n) + c + n) % n;

        y = (modularPow(y, 2, n) + c + n) % n;
        y = (modularPow(y, 2, n) + c + n) % n;

        d = __gcd(Math.abs(x - y), n);

        if (d === n) {
            return PollardRho(n);
        }
    }
    return d;
}

// Recursive function to return gcd of a and b
function __gcd(a, b) {
    return b === 0 ? a : __gcd(b, a % b);
}

let osc;
function mouseClicked() {
    if(insideRect(30, 250, 40, 160)) {
        osc = new p5.Oscillator('sawtooth');
        osc.freq(440, 0);
        osc.amp(0.05, 0);   // i'd like to preserve my ear thanks
        osc.start();
        osc.amp(0, 0.5);
    }
}

function insideRect(a, b, c, d) {
    return mouseX > a && mouseY > c && mouseX < b && mouseY < d;
}

function mouseMoved() {
    updateDotCollision();
}

function mouseDragged() {
    const dx = mouseX - pmouseX;
    if (whichDot >= 0) { // on god
        mapping[whichDotIndex] += dx / xScale;
    } else { // fr fr
        scrollAll(dx);
    }
}

function mouseWheel() {
    let f = pow(1.06, -event.delta / 30);
    xShift = constrain((xShift + mouseX) * f - mouseX,
        -40, Infinity);
    xScale = xScale * f;
}

function scrollAll(dx) {
    xShift -= dx;
    xShift = constrain(xShift, -40, Infinity);
}

function updateDotCollision() {
    for (let i = 0; i < subgroupDotPos.length; i++) {
        if (
            abs(mouseX - subgroupDotPos[i]) < 20 &&
            mouseY > lineYPos - lineHeight &&
            mouseY < lineYPos + lineHeight
        ) {
            whichDot = subgroup[i];
            whichDotIndex = i;
            return;
        }
    }

    whichDot = -1;
    whichDotIndex = -1;
}

function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
