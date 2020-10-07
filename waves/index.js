new p5(app => {

    let noiseMax = 1;
    let zoff = 0;

    let ca, cb;
    let ox, oy;
    let MAX;

    app.setup = () => {
        let canvas = app.createCanvas(app.windowWidth, app.windowHeight);
        canvas.parent('c_waves');
        app.angleMode(app.DEGREES);

        ca = app.color("#F903FAAA");
        cb = app.color("#0CCBCFAA");

        ox = app.width / 2;
        oy = app.height;

        MAX = app.width > app.height ? app.width : app.height;

        app.noFill();
        app.background("#282C30");
    }

    app.draw = () => {
        app.frameCount % 5 === 0 && app.background("#282C3022");
        app.stroke(app.lerpColor(ca, cb, app.abs(app.sin(zoff * 100))));
        app.push();
        app.translate(ox, oy);
        app.beginShape();
        for (let t = 0; t < 360; t++) {
            let xoff = app.map(app.cos(t), -1, 1, 0, noiseMax);
            let yoff = app.map(app.sin(t), -1, 1, 0, noiseMax);

            let n = app.noise(xoff, yoff, zoff);

            let r = app.map(n, 0, 1, 0, app.height * 1.5);
            let x = r * app.cos(t);
            let y = r * app.sin(t);

            //let c = lerpColor(ca, cb, n);

            app.vertex(x, y);
        }
        app.endShape(app.CLOSE);

        zoff += 0.005;
    }

    app.windowResized = () => {
        app.resizeCanvas(app.windowWidth, app.windowHeight)
        app.background("#282C30");
    }
})