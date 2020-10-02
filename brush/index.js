/*
Orginally from Jason Labbe at https://www.openprocessing.org/sketch/916227
*/

var allParticles = [];
var maxSplitCount = 3;
var distThreshold = 75;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 255);
}

function draw() {
    blendMode(BLEND);
    background("#282C30");
    blendMode(SCREEN);

    for (let i = allParticles.length - 1; i > -1; i--) {
        allParticles[i].move();
        if (allParticles[i].vel.mag() < 0.01) {
            allParticles.splice(i, 1);
        }
    }

    if (allParticles.length > 0) {
        let data = Delaunay.triangulate(
            allParticles.map(function (pt) {
                return [pt.pos.x, pt.pos.y];
            }));

        strokeWeight(0.1);

        for (let i = 0; i < data.length; i += 3) {
            let particle1 = allParticles[data[i]];
            let particle2 = allParticles[data[i + 1]];
            let particle3 = allParticles[data[i + 2]];

            if (particle1.pos.dist(particle2.pos) > distThreshold ||
                particle2.pos.dist(particle3.pos) > distThreshold ||
                particle1.pos.dist(particle3.pos) > distThreshold) {
                continue;
            }

            let mass = max(-2 + particle1.life * 0.75, 0);

            drawingContext.shadowColor = color(110 + particle1.life * 1.5, 255, 255, 255 - particle1.life * 5);
            drawingContext.shadowBlur = mass;

            noFill();
            stroke(0);
            strokeWeight(mass);

            triangle(
                particle1.pos.x, particle1.pos.y,
                particle2.pos.x, particle2.pos.y,
                particle3.pos.x, particle3.pos.y);
        }
    }

    drawingContext.shadowBlur = 0;
}

function mouseMoved() {
    frameCount % 2 == 0 && 
        allParticles.push(new Particle(mouseX, mouseY, maxSplitCount))
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}