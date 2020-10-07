/*
Orginally from Jason Labbe at https://www.openprocessing.org/sketch/916227
*/
new p5(app => {

    var allParticles = [];
    var maxSplitCount = 3;
    var distThreshold = 75;

    app.setup = () => {
        const canvas = app.createCanvas(app.windowWidth, app.windowHeight);
        canvas.parent('c_brush');
        app.colorMode(app.HSB, 255);
    }

    app.draw = () => {
        app.blendMode(app.BLEND);
        app.background("#282C30");
        app.blendMode(app.SCREEN);

        for (let i = allParticles.length - 1; i > -1; i--) {
            allParticles[i].move();
            if (allParticles[i].vel.mag() < 0.01) {
                allParticles.splice(i, 1);
            }
        }

        if (allParticles.length > 0) {
            let data = Delaunay.triangulate(
                allParticles.map(pt => {
                    return [pt.pos.x, pt.pos.y];
                }));

            app.strokeWeight(0.1);

            for (let i = 0; i < data.length; i += 3) {
                let particle1 = allParticles[data[i]];
                let particle2 = allParticles[data[i + 1]];
                let particle3 = allParticles[data[i + 2]];

                if (particle1.pos.dist(particle2.pos) > distThreshold ||
                    particle2.pos.dist(particle3.pos) > distThreshold ||
                    particle1.pos.dist(particle3.pos) > distThreshold) {
                    continue;
                }

                let mass = app.max(-2 + particle1.life * 0.75, 0);

                app.drawingContext.shadowColor = app.color(110 + particle1.life * 1.5, 255, 255, 255 - particle1.life * 5);
                app.drawingContext.shadowBlur = mass;

                app.noFill();
                app.stroke(0);
                app.strokeWeight(mass);

                app.triangle(
                    particle1.pos.x, particle1.pos.y,
                    particle2.pos.x, particle2.pos.y,
                    particle3.pos.x, particle3.pos.y);
            }
        }

        app.drawingContext.shadowBlur = 0;
    }

    app.mouseMoved = () => {
        app.frameCount % 2 == 0 &&
            allParticles.push(new Particle(app.mouseX, app.mouseY, maxSplitCount))
    }

    app.windowResized = () => {
        app.resizeCanvas(app.windowWidth, app.windowHeight)
    }


    //////////////////
    function Particle(x, y, splitCount) {
        this.splitCount = splitCount;
        this.life = 0;
        this.pos = new p5.Vector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(app.map(this.splitCount, 0, maxSplitCount, 6, 2));

        this.move = function () {
            this.life++;
            this.vel.mult(0.9);
            this.pos.add(this.vel);

            if (this.life % 10 == 0) {
                if (this.splitCount > 0) {
                    this.splitCount -= 1;
                    allParticles.push(
                        new Particle(this.pos.x, this.pos.y, this.splitCount - 1));
                }
            }
        }
    }
})