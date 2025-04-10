let slices = 8;

function setup() {
  let canvas = createCanvas(900, 300);
  canvas.parent(document.querySelector(".canvas-container"));
  noLoop();
}

function draw() {
  background(255);
  drawPizzas();
}

function drawPizzas() {
  clear();
  background(255);
  slices = parseInt(document.getElementById("slicesInput").value);
  let radius = 80;

  drawPizza(width / 6, height / 2, radius, slices, drawLinePointSlope);
  drawPizza(width / 2, height / 2, radius, slices, drawLineDDA);
  drawPizza((5 * width) / 6, height / 2, radius, slices, drawLineBresenham);
}

function drawPizza(cx, cy, r, numSlices, lineAlgorithm) {
  fill(255, 204, 100);
  stroke(0);
  circle(cx, cy, r * 2);

  for (let i = 0; i < numSlices; i++) {
    let angle = (TWO_PI / numSlices) * i;
    let x = cx + r * cos(angle);
    let y = cy + r * sin(angle);
    lineAlgorithm(cx, cy, x, y);
  }
}

function drawLinePointSlope(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;

  if (abs(dx) > abs(dy)) {
    let m = dy / dx;
    let b = y0 - m * x0;
    let startX = min(x0, x1);
    let endX = max(x0, x1);
    for (let x = startX; x <= endX; x++) {
      let y = m * x + b;
      point(x, y);
    }
  } else {
    let mInv = dx / dy;
    let b = x0 - mInv * y0;
    let startY = min(y0, y1);
    let endY = max(y0, y1);
    for (let y = startY; y <= endY; y++) {
      let x = mInv * y + b;
      point(x, y);
    }
  }
}

function drawLineDDA(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let steps = max(abs(dx), abs(dy));
  let xInc = dx / steps;
  let yInc = dy / steps;

  let x = x0;
  let y = y0;

  for (let i = 0; i <= steps; i++) {
    point(round(x), round(y));
    x += xInc;
    y += yInc;
  }
}

function drawLineBresenham(x0, y0, x1, y1) {
  x0 = round(x0);
  y0 = round(y0);
  x1 = round(x1);
  y1 = round(y1);

  let dx = abs(x1 - x0);
  let dy = abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    point(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}
