{
	const Human = class {
		constructor(size, gravity, x, y, struct) {
			this.points = [];
			this.constraints = [];
			this.shapes = [];
			for (const point of struct.points) {
				this.points.push(
					new Human.Point(x, y, point, size, gravity)
				);
			}
			for (const shape of struct.shapes) {
				this.shapes.push(
					new Human.Shape(
						this.points[shape.p0],
						this.points[shape.p1],
						shape,
						struct.svg[shape.svg],
						size
					)
				);
			}
			for (const constraint of struct.constraints) {
				if (constraint.angle) {
					this.constraints.push(
						new Human.Angle(
							this.points[constraint.p0],
							this.points[constraint.p1],
							this.points[constraint.p2],
							constraint
						)
					);
				} else {
					this.constraints.push(
						new Human.Constraint(
							this.points[constraint.p0],
							this.points[constraint.p1],
							constraint
						)
					);
				}
			}
		}
		anim() {
			for (const point of this.points) point.integrate();
			for (const constraint of this.constraints) constraint.update();
			for (const shape of this.shapes) shape.draw();
		}
	};
	Human.Point = class {
		constructor(x, y, p, s, g) {
			this.x = x + p.x * s;
			this.y = y + p.y * s;
			this.px = this.x;
			this.py = this.y;
			this.vx = 0.0;
			this.vy = 0.0;
			this.m = p.m || 1.0;
			this.g = g;
		}
		join(p1, distance, force) {
			const dx = p1.x - this.x;
			const dy = p1.y - this.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const tw = this.m + p1.m;
			const r1 = p1.m / tw;
			const r0 = this.m / tw;
			const dz = (distance - dist) * force;
			const sx = dx / dist * dz;
			const sy = dy / dist * dz;
			p1.x += sx * r0;
			p1.y += sy * r0;
			this.x -= sx * r1;
			this.y -= sy * r1;
		}
		dist(p1) {
			const dx = this.x - p1.x;
			const dy = this.y - p1.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		integrate() {
			this.vx = this.x - this.px;
			this.vy = this.y - this.py;
			this.px = this.x;
			this.py = this.y;
			this.x += this.vx + this.g * dir;
			this.y += this.vy + 1.0 * (Math.random() - 0.5);
		}
	};
	Human.Shape = class {
		constructor(p0, p1, shape, svg, size) {
			this.p0 = p0;
			this.p1 = p1;
			this.width = shape.w * size;
			this.height = shape.h * size;
			this.offset = shape.offset;
			this.shape = document.createElement("canvas");
			this.shape.width = this.height + this.width * this.offset;
			this.shape.height = this.width;
			const image = new Image();
			image.onload = e => {
				const ctx = this.shape.getContext("2d");
				ctx.drawImage(image, 0, 0, this.height + this.width * this.offset, this.width);
			};
			image.src = "data:image/svg+xml;base64," + window.btoa(svg);
		}
		draw() {
			const a = Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
			ctx.translate(this.p0.x, this.p0.y);
			ctx.rotate(a);
			ctx.drawImage(
				this.shape,
				-this.height * this.offset,
				-this.width * 0.5
			);
			ctx.rotate(-a);
			ctx.translate(-this.p0.x, -this.p0.y);
		}
	};
	Human.Constraint = class {
		constructor(p0, p1, constraint) {
			this.p0 = p0;
			this.p1 = p1;
			this.distance = p0.dist(p1);
			this.force = constraint.force || 1.0;
		}
		update() {
			this.p0.join(this.p1, this.distance, this.force);
		}
	};
	Human.Angle = class {
		constructor(p0, p1, p2, constraint) {
			this.p0 = p0;
			this.p1 = p1;
			this.p2 = p2;
			this.len1 = p0.dist(p1);
			this.len2 = p1.dist(p2);
			this.angle = constraint.angle.value;
			this.range = constraint.angle.range;
			this.force = constraint.force || 0.1;
		}
		a12(p0, p1, p2) {
			const a = Math.atan2(p1.y - p0.y, p1.x - p0.x);
			const b = Math.atan2(p2.y - p1.y, p2.x - p1.x);
			const c = this.angle - (b - a);
			const d = c > Math.PI ? c - 2 * Math.PI : c < -Math.PI ? c + 2 * Math.PI : c;
			const e = Math.abs(d) > this.range
				? (-Math.sign(d) * this.range + d) * this.force
				: 0;
			const m = p0.m + p1.m;
			const m1 = p0.m / m;
			const m2 = p1.m / m;
			const cos = Math.cos(a - e);
			const sin = Math.sin(a - e);
			const x1 = p0.x + (p1.x - p0.x) * m2;
			const y1 = p0.y + (p1.y - p0.y) * m2;
			p0.x = x1 - cos * this.len1 * m2;
			p0.y = y1 - sin * this.len1 * m2;
			p1.x = x1 + cos * this.len1 * m1;
			p1.y = y1 + sin * this.len1 * m1;
			return e;
		}
		a23(e, p1, p2) {
			const a = Math.atan2(p1.y - p2.y, p1.x - p2.x) + e;
			const m = p1.m + p2.m;
			const m2 = p1.m / m;
			const m3 = p2.m / m;
			const cos = Math.cos(a);
			const sin = Math.sin(a);
			const x1 = p2.x + (p1.x - p2.x) * m2;
			const y1 = p2.y + (p1.y - p2.y) * m2;
			p2.x = x1 - cos * this.len2 * m2;
			p2.y = y1 - sin * this.len2 * m2;
			p1.x = x1 + cos * this.len2 * m3;
			p1.y = y1 + sin * this.len2 * m3;
		}
		update() {
			const e = this.a12(this.p0, this.p1, this.p2);
			this.a23(e, this.p1, this.p2);
		}
	};
	const canvas = {
		init() {
			this.elem = document.createElement("canvas");
			document.body.appendChild(this.elem);
			this.resize();
			window.addEventListener("resize", () => canvas.resize(), false);
			const ctx = this.elem.getContext("2d");
			if (!ctx.setLineDash)	{
				ctx.setLineDash = function () {}
			}
			return ctx;
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			this.max = Math.max(canvas.width, canvas.height);
			this.x = this.width * 0.5;
			this.y = this.height * 0.5;
			this.m = 100000;
			this.background = document.createElement("canvas");
			this.background.width = this.width;
			this.background.height = this.height;
			const ctx = this.background.getContext("2d");
			let c = -50;
			for (let i = canvas.max; i >= canvas.max / 10 - 1; i -= canvas.max / 5) {
				ctx.beginPath();
				ctx.arc(canvas.x, canvas.y, i, 0, 2 * Math.PI);
				c += 30;
				ctx.fillStyle = "hsl(208, 30%, " + c + "%)";
				ctx.fill();
			}
		}
	};
	const pointer = {
		init(canvas) {
			this.x = 0;
			this.y = 0;
			this.pointDrag = null;
			this.m = 10000;
			this.msd = 0;
			window.addEventListener("mousemove", e => this.move(e), false);
			canvas.elem.addEventListener("touchmove", e => this.move(e), false);
			window.addEventListener("mousedown", e => this.down(e), false);
			window.addEventListener("touchstart", e => this.down(e), false);
			window.addEventListener("mouseup", e => this.up(e), false);
			window.addEventListener("touchend", e => this.up(e), false);
		},
		down(e) {
			this.move(e);
			this.msd = 1000000;
			this.findPoint(human1);
			this.findPoint(human2);
		},
		findPoint(human) {
			for (const point of human.points) {
				const dx = point.x - this.x;
				const dy = point.y - this.y;
				const sd = dx * dx + dy * dy;
				if (sd < 5000 && sd < this.msd) {
					this.msd = sd;
					this.pointDrag = point;
				}
			}
		},
		drag() {
			this.pointDrag.join(this, 0, 0.02);
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.setLineDash([2,2]);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.pointDrag.x, this.pointDrag.y);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			ctx.fill();
		},
		up(e) {
			this.pointDrag = null;
		},
		move(e) {
			let touchMode = e.targetTouches,
				pointer;
			if (touchMode) {
				e.preventDefault();
				pointer = touchMode[0];
			} else pointer = e;
			this.x = pointer.clientX;
			this.y = pointer.clientY;
		}
	};
	// ---- init ----
	const ctx = canvas.init();
	pointer.init(canvas);
	let dir = 1;
	// ---- main loop ----
	const run = () => {
		requestAnimationFrame(run);
		ctx.drawImage(canvas.background, 0, 0);
		if (Math.random() > 0.997) dir = -dir;
		human1.points[16].join(human2.points[16], 0, 1);
		human1.points[16].join(canvas, 0, 0.02);
		human2.points[16].join(canvas, 0, 0.02);
		human1.anim();
		human2.anim();
		if (pointer.pointDrag) pointer.drag();
	};
	const human = {
		points: [
			{ x: 0, y: 0 },
			{ x: 0, y: -2.8 },
			{ x: 0, y: -4 },
			{ x: -1.1, y: -2.2},
			{ x: 1.1, y: -2.2 },
			{ x: -0.5, y: 1.2 },
			{ x: 0.5, y: 1.2 },
			{ x: 0, y: 1.5 },
			{ x: -0.5, y: 3.5 },
			{ x: 0.5, y: 3.5 },
			{ x: -0.5, y: 6.5 },
			{ x: 0.5, y: 6.5 },
			{ x: -0.5, y: 7 },
			{ x: 0.5, y: 7 },
			{ x: 3, y: -2.2 },
			{ x: -3, y: -2.2 },
			{ x: 4.7, y: -2.2 },
			{ x: -4.7, y: -2.2 }
		],
		constraints: [
			{ p0: 0, p1: 3 },
			{ p0: 0, p1: 4 },
			{ p0: 1, p1: 3 },
			{ p0: 1, p1: 4 },
			{ p0: 3, p1: 4 },
			{ p0: 0, p1: 5 },
			{ p0: 0, p1: 6 },
			{ p0: 7, p1: 5 },
			{ p0: 7, p1: 6 },
			{ p0: 5, p1: 6 },
			{
				p0: 2,
				p1: 1,
				p2: 0,
				angle: { value: 0, range: 1 }
			},
			{
				p0: 3,
				p1: 15,
				p2: 17,
				angle: { value: Math.PI / 2, range: Math.PI / 3 }
			},
			{
				p0: 4,
				p1: 14,
				p2: 16,
				angle: { value: -Math.PI / 2, range: Math.PI / 3 }
			},
			{
				p0: 1,
				p1: 0,
				p2: 7,
				angle: { value: 0, range: 0.3 }
			},
			{
				p0: 0,
				p1: 5,
				p2: 8,
				angle: { value: 0, range: Math.PI / 3 }
			},
			{
				p0: 0,
				p1: 6,
				p2: 9,
				angle: { value: 0, range: Math.PI / 3 }
			},
			{
				p0: 5,
				p1: 8,
				p2: 10,
				angle: { value: Math.PI / 2, range: Math.PI / 3 }
			},
			{
				p0: 6,
				p1: 9,
				p2: 11,
				angle: { value: Math.PI / 2, range: Math.PI / 3 }
			},
			{
				p0: 8,
				p1: 10,
				p2: 12,
				angle: { value: 0, range: 0.2 }
			},
			{
				p0: 9,
				p1: 11,
				p2: 13,
				angle: { value: 0, range: 0.2 }
			}
		],
		shapes: [
			{ p0: 0, p1: 1, h: 3, w: 3.2, svg: "tors", offset: 0.35 },
			{ p0: 1, p1: 2, h: 2, w: 1.8, svg: "head", offset: 0.15 },
			{ p0: 7, p1: 0, h: 2, w: 2.8, svg: "stomach", offset: 0.1 },
			{ p0: 5, p1: 8, h: 3, w: 1.2, svg: "leg1", offset: 0.15 },
			{ p0: 6, p1: 9, h: 3, w: 1.2, svg: "leg1", offset: 0.15 },
			{ p0: 8, p1: 10, h: 4, w: 1.1, svg: "leg2", offset: 0.15 },
			{ p0: 9, p1: 11, h: 4, w: 1.1, svg: "leg2", offset: 0.15 },
			{ p0: 10, p1: 12, h: 0.5, w: 2.5, svg: "foot", offset: 0.3 },
			{ p0: 11, p1: 13, h: 0.5, w: 2.5, svg: "foot", offset: 0.3 },
			{ p0: 4, p1: 14, h: 2.4, w: 1, svg: "arm1", offset: 0.15 },
			{ p0: 3, p1: 15, h: 2.4, w: 1, svg: "arm1", offset: 0.15 },
			{ p0: 14, p1: 16, h: 2.5, w: 0.8, svg: "arm2", offset: 0.1 },
			{ p0: 15, p1: 17, h: 2.5, w: 0.8, svg: "arm2", offset: 0.1 }
		],
		svg: {
			// human shapes credits @roxik http://roxik.com/v/5/
			head: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="70">
				<g transform="scale(2 2) rotate(90) translate(17 -7)">
				<path style="fill:#000000;" d="M-9.9,-38.2Q-6.9 -40.7 -4.35 -39Q-2.3 -40.9 1.85 -41.8Q6.6 -42.85 10.05 -41.25Q12.3 -40.2 14.5 -38Q17 -37.2 18.05 -38.75Q17.85 -36.85 16.6 -35.5L18.4 -32.35Q17.6 -32.5 15.6 -34.25Q15.6 -32.6 17.9 -30L16.15 -30.75Q16.55 -27.2 15.3 -23.35Q14.75 -21.65 16.3 -19.3Q18.05 -16.7 18.05 -16L16.45 -15.1Q15.35 -14.65 14.4 -15.3Q13.65 -14.35 13.3 -10.95Q13 -8.1 11.4 -7.5Q10.25 -7 6.4 -7.5L6.8 -0.85Q7 2.05 5.3 4.05Q3.7 5.9 1.25 6.2Q-1.3 6.55 -3.35 5Q-5.65 3.3 -6.45 -0.25Q-5.5 -2.6 -5.85 -6.75L-6.7 -9.25L-8.55 -6.6Q-9.15 -7.85 -9.55 -10.55Q-9.85 -12.5 -9.95 -12.25Q-10.35 -10.75 -10.9 -10.3Q-10.3 -14.5 -10.95 -17.5L-12.5 -21.6Q-15 -26.45 -14.2 -30.1Q-13.05 -35.55 -9.9 -38.2" />
				</g>
				</svg>
			`,
			tors: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
				<g transform="rotate(90) translate(50 -22) scale(1.4 1.15)">
				<path style="fill:#000000" d="M30.8,-58.3Q34 -55.05 34 -50.5Q34 -47.2 29.5 -39.85Q25 -32.5 25 -31.5Q25 -28.05 23.5 -16.75Q22 -5.4 22 -3.5Q22 5.2 15.85 11.35Q9.7 17.5 1 17.5Q-7.7 17.5 -13.85 11.35Q-20 5.2 -20 -3.5Q-20 -5.4 -21.5 -16.75Q-23 -28.05 -23 -31.5Q-23 -32.5 -28.5 -39.8Q-34 -47.05 -34 -50.5Q-34 -55.05 -30.8 -58.3Q-27.55 -61.5 -23 -61.5Q-20.25 -61.5 -11.85 -64.5Q-3.45 -67.5 0 -67.5Q3.5 -67.5 12 -64.5Q20.5 -61.5 23 -61.5Q27.6 -61.5 30.8 -58.3" />
				</g>
				</svg>
			`,
			stomach: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg"	width="100" height="100">
				<g transform="rotate(90) translate(50 -65) scale(1.5 1.5)">
				<path style="fill:#000000" d="M15.05,-13.35Q21.2 -7.2 21.2 1.5Q21.2 3.3 21.9 7.05L26.15 16.95Q27.6 21.3 25.45 20.8L24.5 20.55Q25.2 24.95 25.2 27Q25.2 33.1 21.45 37.25Q17.6 41.5 11.7 41.5Q3.65 41.5 -0.3 33.4Q-4.35 41.5 -12.3 41.5Q-18.15 41.5 -21.55 37.25Q-24.8 33.25 -24.8 27Q-24.8 24.55 -24.15 20.4L-25.5 20.8Q-27.75 21.3 -26 16.45L-21.3 5.65Q-20.8 2.65 -20.8 1.5Q-20.8 -7.2 -14.65 -13.35Q-8.5 -19.5 0.2 -19.5Q8.85 -19.5 15.05 -13.35" />
				</g>
				</svg>
			`,
			leg1: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="75" height="40">
				<g transform="rotate(90) translate(20 -61) scale(1.5 1)">
				<path style="fill:#000000" d="M10.1,-6.8Q12.9 -2.6 12.55 2.95L12.25 48.65Q11.9 53.8 8.15 57.25Q4.35 60.65 -0.65 60.3Q-5.65 59.95 -8.95 56.05Q-12.2 52.1 -11.85 46.95L-12.55 1.15Q-12.2 -4.45 -8.6 -8.25Q-4.75 -12.35 0.95 -11.95Q6.9 -11.55 10.1 -6.8" />
				</g>
				</svg>
				`,
			leg2: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg"	width="80" height="40">
				<g transform="rotate(-90) translate(-20 15) scale(1.5 1)">
				<path style="fill:#000000" d="M-9.25,-10.2Q-5.45 -14 -0.05 -14Q5.25 -14 8.65 -10.2Q11.95 -6.5 11.95 -1Q8.3 36.25 11.5 44.5Q14.35 51.85 12.95 52.7Q12.65 52.9 11.7 52.7Q10.95 52.55 10.95 52.95Q10 57.85 5.95 61.2Q2.6 64 -0.05 64Q-7.9 64 -11.05 52.95Q-12.3 53.55 -13 52.75Q-14.3 51.15 -11.35 44.25Q-7.95 36.35 -13.05 -1Q-13.05 -6.4 -9.25 -10.2" />
				</g>
				</svg>
			`,
			foot: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg"	width="50" height="50">
				<g transform="rotate(-90) translate(-25 20) scale(0.88 1.5)">
				<path style="fill:#000000" d="M8.25,-6.3Q11.45 -3.05 11.45 1.5L12.75 6.1Q14.1 7.8 18.85 9.75Q23.1 11.5 24.45 11.5Q26.15 11.5 26.55 14.5Q27 17.5 24.45 17.5L9.45 17.5Q8.1 17.5 5.5 15.75Q3.4 14.3 3.45 14.5Q3.6 15.05 3.25 16.15Q2.9 17.3 2.45 17.5L-9.55 17.5L-10.55 1.5Q-10.55 -3.05 -7.35 -6.3Q-4.1 -9.5 0.45 -9.5Q5.05 -9.5 8.25 -6.3" />
				</g>
				</svg>
			`,
			arm1: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg"	width="110" height="44">
				<g transform="matrix(2, 0, 0, 2, 21, 21.5)">
				<path style="fill:#000000" d="M33.45,-6.4L35.65 -6.4Q39.7 -6.4 42.15 -4.3Q44.4 -2.4 44.5 0.3Q44.55 3 42.35 4.85Q39.95 6.95 35.6 6.95L34.6 7Q34.85 8.9 34.25 9.75Q33.2 8.9 29.35 8.55Q27.85 10.25 20.4 8.5L7.5 9.75L2.2 10.55Q-3.7 11.4 -7.2 8.25Q-10.3 5.45 -10.5 0.8Q-10.7 -3.75 -8 -7.1Q-5.05 -10.75 0 -10.75Q1.35 -10.75 4.05 -9.8Q7.1 -8.75 8.3 -8.6L21.65 -8L24.85 -8.9Q26.05 -9 28.6 -7.9Q32.8 -8 34.1 -8.6Q34.4 -7.45 33.45 -6.4" />
				</g>
				</svg>
			`,
			arm2: `
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg"	width="128" height="36">
				<g transform="matrix(2, 0, 0, 2, 15.2, 18.5)">
				<path style="fill:#000000" d="M38.65,-7.65L46.2 -9.25Q46.65 -7.6 44.7 -6.45L41.6 -5.15L48.95 -5.55Q54 -5.85 54.05 -5Q54.1 -3.7 45.35 -1.95L51.6 -2.2Q56.4 -2.25 56.4 -1.25Q56.4 -0.05 52 0.7L45.45 1.85L50.8 2.4Q54.35 2.7 54.3 3.5Q54.25 4.3 49.95 4.65L44.35 4.8Q46.75 5.05 48.6 6.1Q50.45 7.1 49.05 7.4L42.3 7.8Q36.35 7.85 33.4 5.9Q31.1 4.65 15.2 6.8Q-0.55 8.9 -4.3 6.7Q-8.6 4.15 -7.3 -0.75Q-6 -5.75 -0.75 -6.25Q2.35 -6.55 15.7 -4.45L31.2 -3.95Q33.4 -6.4 38.65 -7.65" />
				</g>
				</svg>
			`
		}
	};
	const human1 = new Human(
		Math.sqrt(canvas.width) * 1.4,
		0.1,
		canvas.width / 2 - 10,
		canvas.height / 2,
		human
	);
	const human2 = new Human(
		Math.sqrt(canvas.width) * 1.4,
		-0.1,
		canvas.width / 2 + 10,
		canvas.height / 2,
		human
	);
	run();
}