let slicesInput;
let drawBtn;

function setup() {
  let canvas = createCanvas(900, 400);
  canvas.parent("canvas-container");
  noLoop();

  slicesInput = document.getElementById("slicesInput");
  drawBtn = document.getElementById("drawBtn");

  drawBtn.addEventListener("click", () => {
    redraw();
  });
}

function draw() {
  clear();
  background(255);
  let slices = parseInt(slicesInput.value);
  if (isNaN(slices) || slices < 1) return;

  drawPizza(150, 200, 100, slices, drawLinePuntoPendiente);
  drawPizza(450, 200, 100, slices, drawLineDDA);
  drawPizza(750, 200, 100, slices, drawLineBresenham);
}

function drawPizza(x, y, r, slices, lineFunc) {
  drawCircleMidpoint(x, y, r);
  let angleStep = TWO_PI / slices;

  for (let i = 0; i < slices; i++) {
    let angle = angleStep * i;
    let xEnd = int(x + r * cos(angle));
    let yEnd = int(y + r * sin(angle));
    lineFunc(x, y, xEnd, yEnd);
  }
}

function drawCircleMidpoint(xc, yc, r) {
  let x = 0;
  let y = r;
  let p = 1 - r;

  plotCirclePoints(xc, yc, x, y);
  while (x < y) {
    x++;
    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * (x - y) + 1;
    }
    plotCirclePoints(xc, yc, x, y);
  }
}

function plotCirclePoints(xc, yc, x, y) {
  point(xc + x, yc + y);
  point(xc - x, yc + y);
  point(xc + x, yc - y);
  point(xc - x, yc - y);
  point(xc + y, yc + x);
  point(xc - y, yc + x);
  point(xc + y, yc - x);
  point(xc - y, yc - x);
}

function drawLinePuntoPendiente(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;

  if (abs(dx) > abs(dy)) {
    if (x0 > x1) [x0, y0, x1, y1] = [x1, y1, x0, y0];
    let m = dy / dx;
    let y = y0;
    for (let x = x0; x <= x1; x++) {
      point(x, round(y));
      y += m;
    }
  } else {
    if (y0 > y1) [x0, y0, x1, y1] = [x1, y1, x0, y0];
    let mInv = dx / dy;
    let x = x0;
    for (let y = y0; y <= y1; y++) {
      point(round(x), y);
      x += mInv;
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
