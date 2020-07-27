var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

//铁屑数目
var numFilings = Math.round(innerWidth * 2);
//铁屑长度
var filingLength = 12;
//铁屑
const magStrength = 20;
//磁铁宽度
var magWidth = innerWidth / 2;
//磁铁高度
var magHeight = magWidth / 7;
//当前鼠标X位置
var mouseX = innerWidth / 2;
//当前鼠标Y位置
var mouseY = innerHeight / 2;
//是否在移动
var moving = 0;
//磁铁是否可见
var magnetVisible = 1;
//N极位置
var poleN = mouseX - magWidth / 2 + magHeight / 2;
//S极位置
var poleS = mouseX + magWidth / 2 - magHeight / 2;

function Filing() {
    //铁屑出现的位置
    this.x = Math.random() * innerWidth;
    this.y = Math.random() * innerHeight;

    this.facing = Math.random() * 2;
    this.nearN;//是否在N极附近
    this.nearS;//是否在S极附近
    this.length = Math.random();//
    this.dynamicSpeed = 0.025 + Math.random() * 0.025;
}

function drawCompass(rotate, x, y) {
    var triangleLength = 12
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate(rotate)
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(0, -triangleLength / 2)
    this.ctx.lineTo(-triangleLength * Math.sin(Math.PI / 3), 0)
    this.ctx.lineTo(0, triangleLength / 2)
    // this.ctx.close()
    this.ctx.fillStyle = "blue"
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(0, -triangleLength / 2)
    this.ctx.lineTo(triangleLength * Math.sin(Math.PI / 3), 0)
    this.ctx.lineTo(0, triangleLength / 2)
    // this.ctx.close()
    this.ctx.fillStyle = "red"
    this.ctx.fill()
    this.ctx.restore()

}

Filing.prototype.rotate = function () {
    var deltaX, deltaY, theta, pX, bias;
    if (this.x < mouseX) {
        pX = poleN;
        this.nearN = 1;
        this.nearS = 0;
    } else {
        pX = poleS;
        this.nearN = 0;
        this.nearS = 1;
    }
    if (this.x < poleN || this.x > poleS) {
        deltaX = pX - this.x;
        deltaY = mouseY - this.y;
        theta = Math.atan(deltaY / deltaX);
        if (this.nearS) {
            theta += Math.PI;
        }
    } else {
        bias = Math.abs((this.x - mouseX) / (pX - mouseX));
        deltaX = pX - this.x;
        deltaY = (mouseY - this.y) * bias;
        theta = Math.atan(deltaY / deltaX) + Math.PI;
        if (this.nearS) {
            theta += Math.PI;
        }
    }
    this.facing = theta / Math.PI;
};

Filing.prototype.drawNormal = function () {
    ctx.strokeStyle = this.nearN ? '#f00' : '#00f';
    var x1 = this.x + Math.cos(Math.PI * this.facing) * filingLength;
    var y1 = this.y + Math.sin(Math.PI * this.facing) * filingLength;
    var x2 = this.x + Math.cos(Math.PI * (this.facing + 1)) * filingLength;
    var y2 = this.y + Math.sin(Math.PI * (this.facing + 1)) * filingLength;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

Filing.prototype.drawDynamic = function () {
    this.length + this.dynamicSpeed >= 1 ? (this.length = 0,
            this.x = Math.random() * innerWidth,
            this.y = Math.random() * innerHeight,
            this.rotate()
    ) : this.length += this.dynamicSpeed;
    var lightness = 60 * this.length;

    if (this.nearN) {
        ctx.strokeStyle = 'hsl(0,100%,' + lightness + '%)';
        var x1 = this.x + Math.cos(Math.PI * this.facing) * (filingLength * this.length * 2);
        var y1 = this.y + Math.sin(Math.PI * this.facing) * (filingLength * this.length * 2);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    } else {
        ctx.strokeStyle = 'hsl(240,100%,' + lightness + '%)';
        ctx.strokeStyle = this.nearN ? 'hsl(0,100%,' + lightness + '%)' : 'hsl(240,100%,' + lightness + '%)';
        var x1 = this.x - Math.cos(Math.PI * this.facing) * (filingLength * this.length * 2);
        var y1 = this.y - Math.sin(Math.PI * this.facing) * (filingLength * this.length * 2);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
};

var filings = [];

for (var i = 0; i < numFilings; i++) {
    filings.push(new Filing);
    filings[i].rotate();
}

document.addEventListener('mousemove', function (e) {
    moving = 1;
    mouseX = e.clientX;
    mouseY = e.clientY;
    poleN = mouseX - magWidth / 2 + magHeight / 2;
    poleS = mouseX + magWidth / 2 - magHeight / 2;
})

document.addEventListener('click', function () {
    magnetVisible = magnetVisible ? 0 : 1;
})

function drawMagnetLine() {
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#876223';
        ctx.moveTo(poleN,mouseY);
        ctx.quadraticCurveTo(mouseX,mouseY  - 200 * Math.sin(Math.PI/2/20*(i+1)) * i,poleS,mouseY);
        ctx.stroke();
    }
}
//绘制磁铁
function drawMagnet() {
    ctx.fillStyle = '#c00';
    ctx.fillRect(mouseX - magWidth / 2, mouseY - magHeight / 2, magWidth / 2, magHeight);
    ctx.fillStyle = "#ddd";
    ctx.fillRect(mouseX, mouseY - magHeight / 2, magWidth / 2, magHeight);
}

//绘制磁极的点
function drawAttrPoints() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(poleN - 1, mouseY - 1, 2, 2);
    ctx.fillRect(poleS - 1, mouseY - 1, 2, 2);
}

function animate() {
    if (magnetVisible) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);
    }

    for (var i = 0; i < filings.length; i++) {
        if (magnetVisible) {
            filings[i].drawNormal();

        } else {
            filings[i].drawDynamic();
        }
        if (moving) {
            filings[i].rotate();
        }

        // if (filings[i].x > mouseX) {
        //     drawCompass(filings[i].facing * Math.PI + Math.PI, filings[i].x, filings[i].y)
        // } else {
        //     drawCompass(filings[i].facing * Math.PI, filings[i].x, filings[i].y)
        // }

    }

    if (mouseX && magnetVisible) {
        // drawMagnetLine();
        drawMagnet();

    } else {
        drawAttrPoints();
    }

    moving = 0;
    window.requestAnimationFrame(animate);
}

animate();