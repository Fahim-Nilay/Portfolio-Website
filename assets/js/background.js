(() => {
  "use strict";

  const canvas = document.getElementById("demo-canvas");
  if (!canvas) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldAnimate = !prefersReducedMotion && window.innerWidth >= 768;
  if (!shouldAnimate || typeof window.gsap === "undefined") {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let points = [];
  let target = { x: width / 2, y: height / 2 };
  let animateHeader = true;

  const setCanvasSize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    target = { x: width / 2, y: height / 2 };
  };

  const getDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  };

  const buildPoints = () => {
    points = [];
    const stepX = width / 20;
    const stepY = height / 20;

    for (let x = 0; x < width; x += stepX) {
      for (let y = 0; y < height; y += stepY) {
        const px = x + Math.random() * stepX;
        const py = y + Math.random() * stepY;
        points.push({ x: px, originX: px, y: py, originY: py });
      }
    }
  };

  const buildClosest = () => {
    for (const point of points) {
      const closest = [];
      for (const candidate of points) {
        if (point === candidate) {
          continue;
        }

        if (closest.length < 5) {
          closest.push(candidate);
          continue;
        }

        let farthestIndex = 0;
        for (let i = 1; i < closest.length; i += 1) {
          if (getDistance(point, closest[i]) > getDistance(point, closest[farthestIndex])) {
            farthestIndex = i;
          }
        }

        if (getDistance(point, candidate) < getDistance(point, closest[farthestIndex])) {
          closest[farthestIndex] = candidate;
        }
      }
      point.closest = closest;
    }
  };

  class Circle {
    constructor(pos, radius) {
      this.pos = pos;
      this.radius = radius;
      this.active = 0;
    }

    draw() {
      if (!this.active) {
        return;
      }
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(255,255,255,${this.active})`;
      ctx.fill();
    }
  }

  const shiftPoint = (point) => {
    gsap.to(point, {
      duration: 1 + Math.random(),
      x: point.originX - 50 + Math.random() * 100,
      y: point.originY - 50 + Math.random() * 100,
      ease: "circ.out",
      onComplete: () => shiftPoint(point)
    });
  };

  const drawLines = (point) => {
    if (!point.active) {
      return;
    }
    for (const closePoint of point.closest) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(closePoint.x, closePoint.y);
      ctx.strokeStyle = `rgba(156,217,249,${point.active})`;
      ctx.stroke();
    }
  };

  const animate = () => {
    if (animateHeader) {
      ctx.clearRect(0, 0, width, height);
      for (const point of points) {
        const distance = Math.abs(getDistance(target, point));
        if (distance < 4000) {
          point.active = 0.3;
          point.circle.active = 0.6;
        } else if (distance < 20000) {
          point.active = 0.1;
          point.circle.active = 0.3;
        } else if (distance < 40000) {
          point.active = 0.02;
          point.circle.active = 0.1;
        } else {
          point.active = 0;
          point.circle.active = 0;
        }

        drawLines(point);
        point.circle.draw();
      }
    }
    window.requestAnimationFrame(animate);
  };

  const handleMouseMove = (event) => {
    let posX = event.pageX;
    let posY = event.pageY;
    if (typeof posX !== "number") {
      posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posX;
    target.y = posY;
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0;
    animateHeader = scrollTop <= height;
  };

  const rebuildScene = () => {
    if (window.gsap) {
      gsap.killTweensOf(points);
    }
    setCanvasSize();
    buildPoints();
    buildClosest();
    points.forEach((point) => {
      point.circle = new Circle(point, 2 + Math.random() * 2);
      shiftPoint(point);
    });
  };

  const init = () => {
    setCanvasSize();
    buildPoints();
    buildClosest();
    points.forEach((point) => {
      point.circle = new Circle(point, 2 + Math.random() * 2);
      shiftPoint(point);
    });
    animate();
  };

  if (!("ontouchstart" in window)) {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
  }
  window.addEventListener("scroll", handleScroll, { passive: true });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuildScene, 200);
  });

  init();
})();
