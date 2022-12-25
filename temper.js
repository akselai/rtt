var subgroup = [2, 3, 5];
var mapping = [2, 3, 5];
var subgroupDotPos = [];
var whichDot = -1;

var xshift = -20;
var xscale = 50;

var line_y_pos = 100;
var line_height = 20; // line vertical padding

var mfont;
var smoothNum;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 255);
  mfont = loadFont("data/cmunss.ttf");
  textFont(mfont);
  smoothNum = listSmooth(subgroup, 1, 200);
}

function draw() {
//if(frameCount > 100) debugger;
  background(255);
  line(0, line_y_pos, 800, 100);
  textAlign(CENTER);
  for (let i = 0; i < mapping.length; i++) {
    subgroupDotPos[i] = xscale * mapping[i] - xshift;
  }
  var magnify = pow(10, round(log(xscale) / log(10)) - 1);
  
  for (let i = round(xshift / xscale * magnify) / magnify;
    i <= round((800 + xshift) / xscale * magnify) / magnify;
    i += 1/magnify) {
    stroke(141, 255, 255, 180);
    if (round(i * magnify) % 10 == 0) {
      line(xscale * i - xshift, 100, xscale * i - xshift, 130);
      fill(141, 255, 255, 180);
      noStroke();
      text(round(i * magnify) / magnify, xscale * i - xshift, 150);
    } else {
      line(xscale * i - xshift, 100, xscale * i - xshift, 115);
    }
  }

  for (let i = 0; i <= smoothNum.length; i++) {
    fill(0);
    noStroke();
    text(smoothNum[i], xscale * mapInteger(smoothNum[i]) - xshift, 80);
    stroke(0);
    fill(((smoothNum[i] * 17) % 64) / 64 * 255, 255, 255);
    if (whichDot != smoothNum[i]) {
      fill(255);
    }
    circle(xscale * mapInteger(smoothNum[i]) - xshift, 100, 10);
  }
}

function drawDots() {
	
}

function mapInteger(n) {
  var factors = primeFactors(n);
  var m = 1;
  for (let i = 0; i < factors.length; i++) {
    var f = factors[i];
    var a = subgroup.indexOf(f);
	console.log(a);
    if (a != -1) {
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
      result = [];
      for (let i = 0; i <= x21; i++) {
        for (let j = 0; j <= x22; j++) {
          let k = higher[i][j];
          // k >= (lower[i] == undefined || lower[i][j] <= 0 ? 0 : lower[i][j])
          if (lower[i] == undefined) {
              lower[i] = [];
          }
          if (lower[i][j] == undefined) {
              lower[i][j] = 0;
          }
          while (k >= 0) {
            result[result.length] = pow(p1, i) * pow(p2, j) * pow(p3, k);
            k--;
          }
        }
      }
      return result.sort((a, b) => a - b);
      break;
    default:
      return;
  }
}



function primeFactors(n) {
  let factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

/* Function to calculate (base^exponent)%modulus */
function modular_pow(base, exponent, modulus) {
  let  result = 1;
  while (exponent > 0) {
    if (exponent % 2 == 1) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1;
    base = (base * base) % modulus;
  }
  return result;
}

function PollardRho(n) {
  if (n == 1) {
    return n;
  }
  if (n % 2 == 0) {
    return 2;
  }

  let x = (Math.floor(Math.random() * (-n + 1) ));
  let y = x;

  let c = (Math.floor(Math.random() * (-n + 1)));

  let d = 1;
  while (d == 1) {
    x = (modular_pow(x, 2, n) + c + n) % n;

    y = (modular_pow(y, 2, n) + c + n) % n;
    y = (modular_pow(y, 2, n) + c + n) % n;

    d = __gcd(Math.abs(x - y), n);

    if (d == n) {
      return PollardRho(n);
    }
  }
  return d;
}

// Recursive function to return gcd of a and b
function __gcd(a, b) {
  return b == 0? a:__gcd(b, a % b);
}

function mouseMoved() {
  whichDot = is_dot_collided()
}

function mouseDragged() {
  var dx = mouseX - pmouseX;
  if (whichDot >= 0) { // on god
    mapping[i] += dx / xscale;
  } else {
    scroll_all(dx);
  }
}

function mouseWheel() {
  let f = pow(1.06, -event.delta / 30);
  xshift = constrain((xshift + mouseX) * f - mouseX,
    -40, Infinity);
  xscale = xscale * f;
}

function scroll_all(dx) {
  xshift -= dx;
  xshift = constrain(xshift, -40, Infinity);
}

function is_dot_collided() {
  for (i = 0; i < subgroupDotPos.length; i++) {
    if (
      abs(mouseX - subgroupDotPos[i]) < 20 &&
      mouseY > line_y_pos - line_height &&
      mouseY < line_y_pos + line_height
      ) {
      return subgroup[i];
    }
  }
  return -1;
}