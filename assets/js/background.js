(function() {
    var width, height, canvas, ctx, points, target, animateHeader = true;

    // Main
    initAnimation();
    addListeners();

    function initAnimation() {

        width = innerWidth;
        height = innerHeight;

        width = window.innerWidth;
        height = window.innerHeight;

        target = {x: width/2, y: height/2};

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }

        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
    }

    function mouseMove(e) {
        var posx, posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        gsap.to(p, {
            duration: 1 + 1 * Math.random(),
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100,
            ease: "circ.out",
            onComplete: function () {
                shiftPoint(p);
            }
        });
    }

    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.active+')';
            ctx.fill();
        };
    }

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
})();



// Spider animation

// let w, h;
// const ctx = canvas.getContext("2d");
// const { sin, cos, PI, hypot, min, max } = Math;

// function spawn() {
    
//     const pts = many(333, () => {
//         return {
//             x: rnd(innerWidth),
//             y: rnd(innerHeight),
//             len: 0,
//             r: 0
//         };
//     });
    
//     const pts2 = many(9, (i) => {
//         return {
//             x: cos((i / 9) * PI * 2),
//             y: sin((i / 9) * PI * 2)
//         };
//     });
    
//     let seed = rnd(100)
//     let tx = rnd(innerWidth); 
//     let ty = rnd(innerHeight);
//     let x = rnd(innerWidth)
//     let y = rnd(innerHeight)
//     let kx = rnd(0.8, 0.8)
//     let ky = rnd(0.8, 0.8)
//     let walkRadius = pt(rnd(50,50), rnd(50,50))
//    let r = innerWidth / rnd(100, 150);
    
//     function paintPt(pt){
//         pts2.forEach((pt2) => {
//             if (!pt.len )
//                 return
//             drawLine(
//                 lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
//                 lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
//                 x + pt2.x * r,
//                 y + pt2.y * r
//             );
//         });
//         drawCircle(pt.x, pt.y, pt.r);
//     }
  
//     return {
//         follow(x,y) {
//             tx = x;
//             ty = y;
//         },
        
//         tick(t) {
        
//     const selfMoveX = cos(t*kx+seed)*walkRadius.x;
//     const selfMoveY = sin(t*ky+seed)*walkRadius.y;
//     let fx = tx + selfMoveX;         
//     let fy = ty + selfMoveY; 
            
//     x += min(innerWidth/100, (fx - x)/10)
//     y += min(innerWidth/100, (fy - y)/10)
            
//     let i = 0
//     pts.forEach((pt) => {
//         const dx = pt.x - x,
//             dy = pt.y - y;
//         const len = hypot(dx, dy);
//         let r = min(2, innerWidth / len / 5);
//         pt.t = 0;
//         const increasing = len < innerWidth / 10 
//             && (i++) < 8;
//         let dir = increasing ? 0.1 : -0.1;
//         if (increasing) {
//             r *= 1.5;
//         }
//         pt.r = r;
//         pt.len = max(0, min(pt.len + dir, 1));
//         paintPt(pt)
//     });               
//         } 
//     }
// }

// const spiders = many(2, spawn)

// addEventListener("pointermove", (e) => {
//     spiders.forEach(spider => {
//         spider.follow(e.clientX, e.clientY)
//     })
// });
// requestAnimationFrame(function anim(t) {
//     if (w !== innerWidth) w = canvas.width = innerWidth;
//     if (h !== innerHeight) h = canvas.height = innerHeight;
    
//     // Clear the canvas with transparency
//     ctx.clearRect(0, 0, w, h);
    
//     ctx.fillStyle = ctx.strokeStyle = "#28fce4";
//     t /= 1000;
    
//     spiders.forEach(spider => spider.tick(t));
//     requestAnimationFrame(anim);
// });


// function recalc(X, Y) {
//     tx = X;
//     ty = Y;
// }

// function rnd(x = 1, dx = 0) {
//     return Math.random() * x + dx;
// }

// function drawCircle(x, y, r, color) {
//     ctx.beginPath();
//     ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
//     ctx.fill();
// }

// function drawLine(x0, y0, x1, y1) {
//     ctx.beginPath();
//     ctx.moveTo(x0, y0);

//     many(100, (i) => {
//         i = (i + 1) / 100;
//         let x = lerp(x0, x1, i);
//         let y = lerp(y0, y1, i);
//         let k = noise(x/5+x0, y/5+y0) * 2;
//         ctx.lineTo(x + k, y + k);
//     });

//     ctx.stroke();
// }

// function many(n, f) {
//     return [...Array(n)].map((_, i) => f(i));
// }

// function lerp(a, b, t) {
//     return a + (b - a) * t;
// }

// function noise(x, y, t = 101) {
//     let w0 = sin(0.3 * x + 1.4 * t + 2.0 + 
//                  2.5 * sin(0.4 * y + -1.3 * t + 1.0));
//     let w1 = sin(0.2 * y + 1.5 * t + 2.8 + 
//                  2.3 * sin(0.5 * x + -1.2 * t + 0.5));
//     return w0 + w1;
// }

// function pt(x,y){
//     return {x,y}
// }

