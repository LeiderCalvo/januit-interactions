function Particle(x, y, splitCount) {
    this.splitCount = splitCount;
    this.life = 0;
    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(map(this.splitCount, 0, maxSplitCount, 6, 2));

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