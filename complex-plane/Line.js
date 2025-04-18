function Line(prec, length, angle, center){
	this.ctx = ctx;
	this.can;
	this.ratio;
	this.prec = prec;
	this.funct;
	this.aspect;

	this.wInU;
	this.hInU;

	this.canv

	this.length=length;
	this.angle=angle;
	this.center=center;

	this.change = function(prec, length, angle, center ,canv){
		this.ctx = canv.ctx;
		this.can = canv.can;
		this.u=canv.u;
		this.ratio = canv.ratio;
		this.prec=prec;
		this.funct = canv.funct;
		this.aspect = canv.aspect;
		this.canv=canv;

		this.angle=angle;
		this.center=center;
		this.length=length;
		
		this.wInU = canv.wInU;
		this.hInU = canv.hInU;


		this.func = function(x){
			return canv.funct.evaluate(x);
		}
	}

	this.draw = function () {

		var direction = math.complex(math.cos(this.angle), math.sin(this.angle));
		var trans = this.func(math.add(math.multiply(direction, -this.length, 1/2) , this.center));
		

		this.ctx.beginPath();
		this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));

		this.ctx.strokeStyle = "rgba(255,10,0,0.7)"
		for (var j = -this.length / (2*this.prec); j <= this.length / (2*this.prec); j += 1) {
			orig = math.add(math.multiply(direction,j*this.prec), this.center);
			trans = this.func(orig);
			this.ctx.lineTo(this.xToPix(trans.re), this.yToPix(trans.im));
		}
		ctx.stroke();
	}



	this.xFromPix = function(x){
		return this.canv.xFromPix(x);
	}
	this.yFromPix = function(x){
		return this.canv.yFromPix(x);
	}
	
	this.xToPix = function(x){
		return this.canv.xToPix(x);
	}
	this.yToPix = function(x){
		return this.canv.yToPix(x);
	}
}