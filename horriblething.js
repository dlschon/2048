$(function(){

// VARIABLEZ
// play with them
var c = document.querySelector('canvas'),
	ctx = c.getContext('2d'),
	width = c.width = window.innerWidth,
	height = c.height = window.innerHeight,

	fw1, fw2, fw3, fw4, //firework objects
	minStrength = 1.5, //lowest firework power
	maxStrength = 4, //highest firework power
	minTrails = 7, //min particles/trails
	maxTrails = 30, //max particles/trails
	particleRadius = 3,
	trailLength = 15, //particle trail length
	delay = .5, // number of LIFEs between explosions

	LIFE = 150, //life time of firework

	g = 5e-2, //strength of gravity
	D = 1e-3; //strength of drag (air resistance)

// Particle Class
var Particle = function(x,y,vx,vy,ax,ay,colour) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.ax = ax;
	this.ay = ay;
	this.life = LIFE; //only here for opacity in .draw() method
	this.path = [];
	this.colour = colour;
	this.r = particleRadius;

	this.update = function() {
		this.life--;

		// add point to path but if full, remove a point first
		if (this.path.length >= trailLength) this.path.shift();
		this.path.push([this.x,this.y])

		// update speed n position n stuff
		this.vy += this.ay;
		this.vx += this.ax;
		this.x += this.vx;
		this.y += this.vy;
	}

	this.draw = function() {
		var opacity = ~~(this.life*100/LIFE) /100;

		// tail      
		ctx.fillStyle = 'rgba('+this.colour+(opacity*0.4)+')';
		if (this.life > LIFE*0.95) ctx.fillStyle = '#fff';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.x-this.r, this.y);
		var i = this.path.length -1;
		ctx.lineTo(this.path[0][0], this.path[0][1]);
		ctx.lineTo(this.x+this.r, this.y);
		ctx.closePath();
		ctx.fill();

		// main dot
		ctx.fillStyle = 'rgba('+this.colour+opacity+')';
		if (this.life > LIFE*0.95) ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(~~this.x,~~this.y,this.r,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
}

// Firework class
var Firework = function() {
	this.x = width*(Math.random()*0.8 + 0.1); // from 0.1-0.9 widths
	this.y = height*(Math.random()*0.8 + 0.1); // from 0.1-0.9 heights
	this.strength = Math.random()*(maxStrength-minStrength) +minStrength;
	this.colour =
		~~(Math.random()*255)+','+
		~~(Math.random()*255)+','+
		~~(Math.random()*255)+',';
	this.life = 0;
	this.particles = (function(x,y,strength,colour){
		var p = [];

		var n = ~~(Math.random()*(maxTrails-minTrails)) +minTrails;
		var ay = g;
		for(var i = n;i--;){
			var ax = D;
			var angle = i*Math.PI*2/n;
			if (angle < Math.PI) ax *= -1;
			var vx = strength*Math.sin(angle);
			var vy = strength*Math.cos(angle);
			p.push(new Particle(x,y,vx,vy,ax,ay,colour));
		}

		return p;
	})(this.x,this.y,this.strength,this.colour);

	this.update = function() {
		this.life++;
		if (this.life < 0) return; //allows life to be delayed
		for(var i = this.particles.length;i--;){
			this.particles[i].update();       
			this.particles[i].draw();
			//wasn't bothered to make an extra draw function for firework class
		}
	}
};

var Star = function() {
	this.x = Math.random()*width;
	this.y = Math.random()*height;
	this.r = Math.random()*maxStarRadius;
	this.b = ~~(Math.random()*100) /100;
	this.draw = function() {
		this.b += twinkleFactor*(Math.random()-.5);
		ctx.fillStyle = 'rgba(255,255,255,'+this.b+')';
		ctx.beginPath();
		ctx.arc(~~this.x,~~this.y,this.r,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
}

function createStars() {
	for(var i = n_stars;i--;) {
		stars.push(new Star);
	}
}

function main() {
	fw1.update();
	fw2.update();
	fw3.update();
	fw4.update();

	if (fw1.life >= LIFE*delay/4) fw2 = new Firework;
	if (fw2.life >= LIFE*delay/4) fw3 = new Firework;
	if (fw3.life >= LIFE*delay/4) fw4 = new Firework;
	if (fw4.life >= LIFE*delay/4) fw1 = new Firework;

	window.requestAnimationFrame(main);
}

function init() {
	fw1 = new Firework;
	fw2 = new Firework;
	fw3 = new Firework;
	fw4 = new Firework;
	
	fw2.life = -LIFE*delay/2;
	fw3.life = -LIFE*delay/3;
	fw4.life = -LIFE*delay/4;
	main();
}

init();
  
});
