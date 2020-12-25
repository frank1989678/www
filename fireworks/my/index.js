!(function() {
	// // resize
	// $(window).on('resize', function() {
	// 	setCanvasSize(canvas);
	// 	ctx.fillStyle = '#000003';
	// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 	center = { x: canvas.width / 2, y: canvas.height / 2 };
	// });

// 烟花类型
var fireworkTypes = {
	randColor: function() {
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);
		var color = 'rgb($r, $g, $b)';
		color = color.replace('$r', r);
		color = color.replace('$g', g);
		color = color.replace('$b', b);
		return 'rgb(255,120,0)';
		return color;
	},
	makeDoubleFullCircleFirework: function(fire) {
		var color = this.randColor();
		var velocity = Math.random() * 8 + 8;
		var max = fireNumber * 3;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
				vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
				ay: 0.04,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		// color = this.randColor();
		velocity = Math.random() * 3 + 4;
		max = fireNumber * 2;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
				vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
				ay: 0.06,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		max = fireNumber * 4;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity * Math.random(),
				vy: Math.sin(rad) * velocity * Math.random(),
				ay: 0.06,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		return color;
	},
	makeFullCircleFirework: function(fire) {
		var color = this.randColor();
		var velocity = Math.random() * 8 + 8;
		var max = fireNumber * 3;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
				vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
				ay: 0.06,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		max = fireNumber * Math.round(Math.random() * 4 + 4);
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity * Math.random(),
				vy: Math.sin(rad) * velocity * Math.random(),
				ay: 0.06,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		return color;
	},

	makeDoubleCircleFirework: function(fire) {
		var color = this.randColor();
		var velocity = Math.random() * 2 + 8;
		var max = fireNumber * 3;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
				vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
				ay: 0.04,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		// color = this.randColor();
		velocity = Math.random() * 3 + 4;
		for (var i = 0; i < max; i++) {
			var rad = (i * Math.PI * 2) / max;
			var firework = {
				x: fire.x,
				y: fire.y,
				size: Math.random() + 1.5,
				fill: color,
				vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
				vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
				ay: 0.04,
				alpha: 1,
				life: Math.round(Math.random() * range / 2) + range / 1.5
			};
			firework.base = {
				life: firework.life,
				size: firework.size
			};
			listFirework.push(firework);
		}
		return color;
	},
}


// 设置舞台的尺寸
function getCanvasSize() {
	return {
		width: document.documentElement.clientWidth || document.body.clientWidth,
		height: document.documentElement.clientHeight || document.body.clientHeight
	}
}

	// init
	var listFires = [];
	var listFirework = [];
	var lights = [];
	var fireNumber = 10;
	var center = { x: 0, y: 0 };
	var range = 100;
	var fired = 0;

	var winSize = getCanvasSize();
	var canvas = document.getElementById('canvasFireworks');
	var ctx = canvas.getContext('2d');


	function Fireworks() {
		this.init();
	}

	Fireworks.prototype = {
		init: function() {
			this.createStage();
		},
		// 创建舞台
		createStage: function() {
			var that = this;
			var img = new Image();
			img.onload = function() {
				winSize.height = winSize.width / (img.width / img.height);
				canvas.width = winSize.width;
				canvas.height = winSize.height;
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, winSize.width, winSize.height);
				center = { x: canvas.width / 2, y: canvas.height / 2 };
				that.createFires(); // 创建普通烟花
				that.onFire();
				img.onload = null;
			}
			img.src = 'bg.jpg';
			this.img = img;
		},
		createFires: function() {
			var count = fireNumber;
			while (count-- > 0) {
				var fire = {
					x: Math.random() * range / 2 - range / 4 + center.x,
					y: Math.random() * range * 2.5 + canvas.height,
					vx: Math.random() - 0.5,
					vy: -(Math.random() + 4),
					ax: Math.random() * 0.06 - 0.03,
					far: Math.random() * range + (center.y - range),
					size: Math.random() + 0.5,
					delay: Math.round(Math.random() * range) + range * 4,
					hold: false,
					alpha: 1,
					fill: '#ff3'
				};
				fire.base = {
					x: fire.x,
					y: fire.y,
					vx: fire.vx,
					vy: fire.vy
				};
				listFires.push(fire);
				count -= 8;
			}
		},

		// 停止
		onStop: function() {
			this.timerId && window.cancelAnimationFrame(this.timerId);
		},
		// 燃放烟花
		onFire: function() {
			const that = this;
			that.update();
			// that.draw();

			// requestAnimationFrame(this.onFire.bind(this));
			that.timerId = window.requestAnimationFrame( function() {
				that.onFire();
			});
		},

		update: function() {
			var mode = 1;
			ctx.globalAlpha = 0.2;
			if (mode == 1) {
				var img = this.img;
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, winSize.width, winSize.height);
			} else {
				ctx.fillStyle = '#F42E74';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			var arr = [
				'makeDoubleFullCircleFirework', 
        'makeFullCircleFirework', 
        'makeDoubleCircleFirework'
      ];
			// update fire logic
			var count = listFires.length;
			while (count-- > 0) {
				var fire = listFires[count];
				if (fire.y <= fire.far) {
					// case add firework
					fired ++;
          var actionName = arr[Math.floor(Math.random() * arr.length)];
          var color = fireworkTypes[actionName](fire);
          // var color = fireworkTypes.makeFullCircleFirework(fire);
          // console.log(color);
          // color = 'rgb(255,255,255)';
					lights.push({ x: fire.x, y: fire.y, color: color, radius: range * 2 });

					// reset
					fire.y = fire.base.y;
					fire.x = fire.base.x;

					fire.vx = fire.base.vx;
					fire.vy = fire.base.vy;
					fire.ax = Math.random() * 0.06 - 0.03;
				}

				fire.x += fire.vx;
				fire.y += fire.vy;
				fire.vx += fire.ax;
				fire.alpha = (fire.y - fire.far) / fire.far;

				ctx.globalAlpha = fire.alpha;
				ctx.beginPath();
				ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fillStyle = fire.fill;
				ctx.fill();
			}

			// update firework logic
			count = listFirework.length;
			while (count-- > 0) {
				var firework = listFirework[count];
				firework.vx *= 0.9;
				firework.vy *= 0.9;
				firework.x += firework.vx;
				firework.y += firework.vy;
				firework.vy += firework.ay;
				firework.alpha = firework.life / firework.base.life;
				firework.size = firework.alpha * firework.base.size;
				firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
				firework.life--;
				firework.life <= 0 && listFirework.splice(count, 1);


				ctx.globalAlpha = firework.alpha;
				ctx.beginPath();
				ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fillStyle = firework.fill;
				ctx.fill();
			}

			while (lights.length) {
				var light = lights.pop();
				var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
				gradient.addColorStop(0, '#fff');
				gradient.addColorStop(0.2, light.color);
				gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
				gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				ctx.globalAlpha = light.alpha ? light.alpha : 0.25;
				ctx.fillStyle = gradient;
				ctx.fillRect(light.x - light.radius, light.y - light.radius, light.radius * 2, light.radius * 2);
			}
		},
	}

	var fireworks = new Fireworks();
})();