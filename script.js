let level, tank;
let store = {
  cellSize: 200,
  tank: {
    oldX: 0,
    oldY: 0,
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    isAlive: false,
    isBoosting: false,
    isCharging: false,
    isRev: false,
    charge: 40,
    vel: null,
    heading: -1.566,
    bullet: null,
    bulletVel: null,
    canMove: true,
    light: '#b40000',
    bodyColor: '#026031',
    towerColor: '#00753B',
    botColor: '#333' },

  objects: [],
  particles: [],
  freeCamera: false,
  colors: {
    background: '#0a4729',
    wall: '#833921',
    metal: '#cccccc',
    lightOff: '#b40000',
    lightOn: '#f00f00',
    bullet: '#f2d04b' } };



function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  // noCursor();

  level = new Level();
  tank = new Tank();

  level.create();
}

function draw() {
  background(store.colors.background);

  push();
  tank.control();
  tank.isCharging();

  translate(width / 2, height / 2);

  if (store.freeCamera) {
    translate(-store.tank.x - lerp(width / 2, mouseX, 0.3) + width / 2, -store.tank.y - lerp(height / 2, mouseY, 0.3) + height / 2);
  } else {
    translate(-store.tank.x, -store.tank.y);
  }

  // if (mouseIsPressed && mouseButton === CENTER) {
  //   store.freeCamera = !store.freeCamera;
  // }

  tank.renderParticles();
  level.render();

  if (store.tank.bullet !== null) {
    tank.renderBullet();
    tank.updateBullet();
  }


  tank.render();
  tank.update();



  pop();
  // push();
  // fill('#f00');
  // translate(mouseX, mouseY);
  // ellipse(0, 0, 7, 7);
  // noFill();
  // ellipse(0, 0, 30, 30);
  // pop();

  // console.log(store.tank.heading);
}

function keyReleased() {
  store.tank.isBoosting = false;
  store.tank.light = store.colors.lightOff;
}

function mouseClicked() {
  tank.shoot();
}

// function mousePressed() {
//   if (store.tank.bullet === null) {
//     tank.charge(true);
//   }
// }

// function mouseReleased() {
//   store.tank.isCharging = false;
//   tank.shoot();
// }

const levelCells = [
' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', 'X', 'M', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' ', 'X', ' ', 'X', ' ',
' ', ' ', ' ', ' ', ' ', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' ',
'M', ' ', 'X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X', ' ', 'M',
' ', ' ', ' ', ' ', ' ', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' ',
' ', ' ', ' ', ' ', ' ', 'X', 'X', 'X', ' ', ' ', ' ', ' ', ' ',
' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' ', 'X', ' ', 'X', ' ',
' ', 'X', ' ', 'X', ' ', 'X', 'X', 'X', ' ', 'X', ' ', 'X', ' ',
' ', ' ', ' ', ' ', 'P', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' '];


class Level {
  create() {
    const { cellSize, objects, tank } = store;
    let x = 0,y = 0;

    const xPos = i => {
      switch (i) {
        case 0:return x * cellSize;
        case 1:return x * cellSize + cellSize / 2;
        case 2:return x * cellSize;
        case 3:return x * cellSize + cellSize / 2;
        default:break;}

    };
    const yPos = i => {
      switch (i) {
        case 0:return y * cellSize;
        case 1:return y * cellSize;
        case 2:return y * cellSize + cellSize / 2;
        case 3:return y * cellSize + cellSize / 2;
        default:break;}

    };

    levelCells.forEach(cell => {
      if (x < 13) {
        if (cell === 'X') {
          let i = 0;
          while (i <= 3) {
            objects.push({
              x: xPos(i),
              y: yPos(i),
              type: 'wall',
              hitCount: 3,
              hits: 0,
              rand1: random(20, 50),
              rand2: random(20, 50),
              rand3: random(20, 50),
              rand4: random(20, 50) });

            i++;
          }
        }

        if (cell === 'M') {
          let i = 0;
          while (i <= 3) {
            objects.push({
              x: xPos(i),
              y: yPos(i),
              type: 'metal',
              hitCount: 10,
              hits: 0,
              rand1: random(20, 50),
              rand2: random(20, 50),
              rand3: random(20, 50),
              rand4: random(20, 50) });

            i++;
          }
        }

        if (cell === 'P' && tank.isAlive === false) {
          tank.x = x * cellSize + cellSize / 2;
          tank.y = y * cellSize + cellSize / 2;
          tank.isAlive = true;
          tank.vel = createVector(0, 0);
        }

        x++;
      }

      if (x >= 13) {
        y++;
        x = 0;
      }
    });
  }

  render() {
    push();
    store.objects.forEach(object => {
      const { rand1, rand2, rand3, rand4, x, y, type, hits } = object;


      if (type === 'wall') {
        stroke(store.colors.wall);
        fill(store.colors.wall);
      }
      if (type === 'metal') {
        stroke(store.colors.metal);
        fill(store.colors.metal);
      }

      rect(x, y, store.cellSize / 2, store.cellSize / 2);


      fill('#7c3322');
      stroke('#7c3322');

      if (hits === 1 && type === 'wall') {
        rect(x + rand1, y + rand2, rand1, rand1);
      }
      if (hits === 2 && type === 'wall') {
        rect(x + rand1, y + rand2, rand1, rand1);
        rect(x + rand3, y + rand4, rand3, rand3);
      }

    });
    pop();

    noStroke();
    fill('#013a23');
    rect(-2000, -400, 1600, 4000);
    rect(-2000, -1200, 6500, 1000);
    rect(3000, -400, 1600, 4000);
    rect(-2000, 3400, 6500, 1600);
  }}



const [W, A, S, D] = [87, 65, 83, 68];

const collideRectRect = (x, y, w, h, x2, y2, w2, h2) => {
  if (x + w >= x2 &&
  x <= x2 + w2 &&
  y + h >= y2 &&
  y <= y2 + h2) {
    return true;
  }
  return false;
};

const collideRectCircle = (rx, ry, rw, rh, cx, cy, diameter) => {
  let testX = cx;
  let testY = cy;

  if (cx < rx) {
    testX = rx;
  } else if (cx > rx + rw) {
    testX = rx + rw;
  }

  if (cy < ry) {
    testY = ry;
  } else if (cy > ry + rh) {
    testY = ry + rh;
  }

  let distance = dist(cx, cy, testX, testY);

  if (distance <= diameter / 2) {
    return true;
  }
  return false;
};


class Tank {
  control() {
    const { tank } = store;

    if (keyIsDown(W) && tank.canMove) this.boost('up');
    if (keyIsDown(S) && tank.canMove) this.boost('rev');

    // if (keyIsDown(A)) this.rotate(-0.0566);
    // if (keyIsDown(D)) this.rotate(0.0566);

    if (tank.isRev === false) {
      if (keyIsDown(A)) this.rotate(-0.0566);
      if (keyIsDown(D)) this.rotate(0.0566);
    } else {
      if (keyIsDown(A)) this.rotate(0.0566);
      if (keyIsDown(D)) this.rotate(-0.0566);
    }
  }

  rotate(a) {
    store.tank.heading += a;
  }

  boost(dir) {
    const { tank } = store;
    tank.isBoosting = true;

    if (dir === 'up') {
      const force = p5.Vector.fromAngle(tank.heading);
      force.mult(0.80);
      tank.vel.add(force);

      tank.light = store.colors.lightOn;
      tank.isRev = false;
    }

    if (dir === 'rev') {
      const force = p5.Vector.fromAngle(tank.heading);
      force.mult(-2.2);
      tank.vel.add(force);

      tank.light = store.colors.lightOn;
      tank.isRev = true;
    }

    if (dir === 'rec') {
      tank.isBoosting = false;
      tank.light = store.colors.lightOff;
      const force = p5.Vector.fromAngle(atan2(mouseY - height / 2, mouseX - width / 2));
      force.mult(-0.5);

      tank.vel.add(force);
    }

  }

  update() {
    const { objects, tank, cellSize } = store;

    tank.canMove = true;

    if (tank.x.toFixed(1) !== tank.oldX.toFixed(1) && tank.y.toFixed(1) !== tank.oldY.toFixed(1)) {
      if (tank.x > 3000 || tank.y > 3400 || tank.x < -400 || tank.y < -200) {
        tank.canMove = false;
      }


      objects.forEach((object, i) => {
        if (collideRectRect(
        object.x,
        object.y,
        cellSize / 2,
        cellSize / 2,
        tank.x - 25,
        tank.y - 25,
        tank.width,
        tank.height))
        {
          tank.canMove = false;
          this.destroyObject(object, i);
        }
      });
    }



    if (tank.canMove) {
      tank.oldX = tank.x;
      tank.oldY = tank.y;

      if (tank.isBoosting) this.boost('up');
      tank.x += tank.vel.x;
      tank.y += tank.vel.y;
      tank.vel.mult(0.80);
    } else {
      // if (tank.isBoosting) this.boost('rec');
      // tank.isBoosting = false;
      tank.x -= tank.vel.x;
      tank.y -= tank.vel.y;
      tank.vel.mult(-1.3);
    }
  }

  tower() {
    const { tank } = store;

    fill(tank.towerColor);

    rotate(atan2(mouseY - height / 2, mouseX - width / 2));
    rect(-5, -5, 50, 10);

    ellipse(0, 0, tank.width / 1.5, tank.width / 1.5);
  }

  isCharging() {
    if (store.tank.isCharging) {
      push();
      if (store.tank.charge <= 40) store.tank.charge += 1;
      translate(width / 2, height / 2);
      fill('#333');
      rect(-20, 40, 40, 5);

      noStroke();
      fill('#ccc');
      rect(-20, 40, store.tank.charge, 5);
      pop();

      if (store.tank.charge >= 40) {
        store.tank.isCharging = false;
        store.tank.bullet = null;
      }
    }
  }

  charge() {
    store.tank.charge = 0;
    store.tank.isCharging = true;
  }

  shoot() {
    const { tank } = store;

    if (tank.bullet === null && tank.charge >= 40) {
      this.charge();

      tank.bullet = createVector(tank.x, tank.y);
      tank.bulletVel = createVector(0, 0);

      const force = p5.Vector.fromAngle(atan2(mouseY - height / 2, mouseX - width / 2));
      force.mult(20);
      tank.bulletVel.add(force);

      this.boost('rec');
    }
  }

  updateBullet() {
    const { tank, cellSize, objects } = store;

    tank.bullet.add(tank.bulletVel);

    if (tank.bullet !== null) {
      let collide = false;

      objects.forEach((object, i) => {
        if (collideRectCircle(
        object.x,
        object.y,
        cellSize / 2,
        cellSize / 2,
        tank.bullet.x,
        tank.bullet.y,
        7.5))
        {
          collide = true;
          this.destroyObject(object, i);
        }
      });

      if (collide) {
        tank.bullet = null;
      }
    }
  }

  destroyObject(obj, i) {
    store.objects[i].hits++;

    if (store.objects[i].hits === store.objects[i].hitCount) {
      store.objects.splice(i, 1);
      store.particles.push(createVector(obj.x, obj.y));
      store.particles.push({
        x: obj.x + 25,
        y: obj.y + 25,
        vel1: 1,
        vel2: 1,
        vel3: 1,
        vel4: 1,
        dist1: random(70),
        dist2: random(70),
        dist3: random(70),
        dist4: random(70),
        type: obj.type });

    }
  }

  renderParticles() {
    const { particles } = store;

    if (particles.length) {
      particles.forEach(particle => {
        const { vel1, vel2, vel3, vel4, dist1, dist2, dist3, dist4, x, y } = particle;
        if (vel1 < dist1) particle.vel1 += dist1 / 15;
        if (vel2 < dist2) particle.vel2 += dist2 / 15;
        if (vel3 < dist3) particle.vel3 += dist3 / 15;
        if (vel4 < dist4) particle.vel4 += dist4 / 15;
        push();
        noStroke();

        particle.type === 'wall' ? fill('#7c3322') : fill(store.colors.metal);
        rectMode(CENTER);
        translate(x + 25, y + 25);
        rotate(PI / vel1);
        rect(0 + vel1, 0 + vel1, 50, 50);
        rotate(PI / vel2);
        rect(0 - vel2, 0 - vel2, 50, 50);
        rotate(PI / vel3);
        rect(0 + vel3, 0 - vel3, 50, 50);
        rotate(PI / vel4);
        rect(0 - vel4, 0 + vel4, 50, 50);
        pop();
      });
    }
  }

  renderBullet() {
    push();
    fill(store.colors.bullet);
    translate(store.tank.bullet.x, store.tank.bullet.y);
    ellipse(0, 0, 15, 15);
    pop();
  }



  render() {
    const { tank } = store;

    push();

    fill(tank.bodyColor);
    translate(tank.x, tank.y);
    noStroke();
    push();
    rotate(tank.heading + PI / 2);
    translate(-25, -25);
    rect(0, 0, tank.width, tank.height);
    fill(tank.botColor);
    rect(0, 0, 10, 50);
    rect(40, 0, 10, 50);

    fill(tank.light);
    rect(12, 48, 5, 3);
    rect(33, 48, 5, 3);

    pop();

    this.tower();
    pop();
  }}