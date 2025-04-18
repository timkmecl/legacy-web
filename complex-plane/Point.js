function Point(center){
	this.ctx;
	this.can;
	this.funct;

	this.canv

	this.center=center;

	this.change = function(center, canv){
		this.ctx = canv.ctx;
		this.can = canv.can;
		this.canv=canv;

		this.center=center;

		this.func = function(x){
			return canv.funct.evaluate(x);
		}
	}

	this.draw = function () {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,240,0,0.9)";
		ctx.fillStyle = "rgba(0,240,0,0.9)";

		var trans = this.func(this.center);
		ctx.arc(this.xToPix(trans.re), this.yToPix(trans.im), 5, 0, 2*Math.PI, false);
		ctx.fill();
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