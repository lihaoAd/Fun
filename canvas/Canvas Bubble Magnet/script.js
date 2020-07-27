/* requestAnimationFrame */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
};

if(!window.requestAnimationFrame){
    window.requestAnimationFrame = function(callback, element){
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
};

if (!window.cancelAnimationFrame){
    window.cancelAnimationFrame = function(id){
        clearTimeout(id);
    };
};

/* Magnet */
var c = document.createElement('canvas'),
    ctx = c.getContext('2d'),
    cw = c.width = window.innerWidth,
    ch = c.height = window.innerHeight,
    mx = cw/2,
    my = ch/2,
    pi2 = Math.PI * 2,
    mRadius = 120,
    mRadiusInput = document.getElementById("mRadiusInput"),
    mRadiusDisplay = document.getElementById('mRadiusDisplay'),
    attract = true,
    rand = function(a,b){return ~~((Math.random()*(b-a+1))+a);},
    things = [],
    thingCount = 75,
    minSpeed = .5,
    maxSpeed = 15,
    friction = 0.997,
    Thing = function(){
        this.vx = (rand(0, 1000)-500)/200;
        this.vy = (rand(0, 1000)-500)/200;
        this.x = rand(0, cw);
        this.y = rand(0, ch);
        this.radius = rand(4, 20);
        this.affected = false;
    }

Thing.prototype = {
    update: function(i){
        var dx = mx- this.x;
        var dy = my- this.y;
        var dist = Math.sqrt(dx * dx + dy * dy) - this.radius;
        if(dist < mRadius){
            this.affected = true;
            if(attract){
                this.vx += dx/(10*this.radius);
                this.vy += dy/(10*this.radius);
            } else {
                this.vx -= dx/(10*this.radius);
                this.vy -= dy/(10*this.radius);
            }
        } else {
            this.affected = false;
        }

        if(this.vx > maxSpeed){ this.vx = maxSpeed; }
        if(this.vx < -maxSpeed){ this.vx = -maxSpeed; }
        if(this.vy > maxSpeed){ this.vy = maxSpeed; }
        if(this.vy < -maxSpeed){ this.vy = -maxSpeed; }

        if(Math.abs(this.vx) > minSpeed){
            this.vx *= friction;
        }

        if(Math.abs(this.vy) > minSpeed){
            this.vy *= friction;
        }

        this.x += this.vx;
        this.y += this.vy;

        if(this.x + this.radius > cw){ this.x = cw - this.radius; this.vx = -this.vx; }
        if(this.y + this.radius > ch){ this.y = ch - this.radius; this.vy = -this.vy; }
        if(this.x - this.radius < 0){ this.x = this.radius; this.vx = -this.vx; }
        if(this.y - this.radius < 0){ this.y = this.radius; this.vy = -this.vy; }
    },
    render: function(i){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, pi2, false);
        ctx.fillStyle = 'hsla(0, 0%, 0%, .1)';
        ctx.strokeStyle = 'hsla(0, 0%, 0%, .4)';
        if(this.affected){
            if(attract){
                ctx.fillStyle = 'hsla(190, 80%, 50%, .4)';
                ctx.strokeStyle = 'hsla(190, 80%, 50%, .8)';
            } else {
                ctx.fillStyle = 'hsla(0, 80%, 50%, .4)';
                ctx.strokeStyle = 'hsla(0, 80%, 50%, .8)';
            }
        }
        ctx.fill();
        ctx.stroke();
    }
}

var updateThings = function(){
    var i = things.length;
    while(i--){
        things[i].update(i);
    }
}

var renderThings = function(){
    var i = things.length;
    while(i--){
        things[i].render(i);
    }
}

var renderMRadius = function(){
    ctx.beginPath();
    ctx.arc(mx, my, mRadius, 0, pi2, false);
    if(attract){
        ctx.fillStyle = 'hsla(190, 80%, 50%, .1)';
        ctx.strokeStyle = 'hsla(190, 80%, 50%, .3)';
    } else {
        ctx.fillStyle = 'hsla(0, 80%, 50%, .1)';
        ctx.strokeStyle = 'hsla(0, 80%, 50%, .3)';
    }
    ctx.fill();
    ctx.stroke();
}

var loop = function(){
    requestAnimationFrame(loop, c);
    ctx.clearRect(0, 0, cw, ch);
    updateThings();
    renderThings();
    renderMRadius();
}

var mousemove = function(e){
    mx = e.pageX;
    my = e.pageY;
}

var mousedown = function(){
    attract = (attract) ? false : true;
}

var resize = function(){
    cw = c.width = window.innerWidth;
    ch = c.height = window.innerHeight;
    mx = cw/2;
    my = ch/2;
}

for(var i = 0; i < thingCount; i++){
    things.push(new Thing());
}
window.addEventListener("resize",resize)
window.addEventListener("mousemove",mousemove)
window.addEventListener("mousedown",mousedown)

mRadiusInput.addEventListener("change",function(){
    var val = mRadiusInput.value;
    mRadius = val;
    mRadiusDisplay.innerText = val
})

setTimeout(function(){
    document.body.appendChild(c);
    resize();
    loop();
}, 50);