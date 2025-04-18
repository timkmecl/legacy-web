function Grid(u, prec, canv){
	this.ctx = ctx;
	this.can;
	this.canv=canv;
	this.ratio;
	this.u = u;
	this.prec = prec;
	this.funct;
	this.aspect;

	this.dens;
	this.center;

	this.wInU;
	this.hInU;

	this.canv

	this.change = function(u, center, dens, prec, canv){
		this.ctx = canv.ctx;
		this.can = canv.can;
		this.u=u;
		this.ratio = canv.ratio;
		this.prec=prec;
		this.funct = canv.funct;
		this.aspect = canv.aspect;
		this.canv=canv;

		this.center=center;
		this.dens=dens;
		
		
		this.wInU = canv.wInU;
		this.hInU = canv.hInU;


		this.func = function(x){
			return canv.funct.evaluate(x);
		}
	}





	this.draw = function(){
		var line = new Line(this.prec/this.dens, this.u*2, 0, this.center);
		line.change(this.prec/this.dens, this.u*2, 0, this.center, this.canv);
		
		for(var i = -this.u; i<= this.u; i+=1/this.dens){
			line.center = math.complex(math.add(this.center, math.complex(0, i)));
			line.draw();
		}

		line.angle=Math.PI/2;
		for(var i = -this.u; i<= this.u; i+=1/this.dens){
			line.center = math.complex(math.add(this.center, math.complex(i, 0)));
			line.draw();
		}
	}
	
/*
	this.draw1 = function(){
		for(var i = -this.u; i<=this.u; i+=0.5){
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(255,0,0,0.5)"
	
			var orig = math.complex(i, -u);
			var trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			
			this.ctx.stroke();
			this.ctx.beginPath();
			orig = math.complex(i, this.u/10000);
			trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			for(var j = this.prec; j <= this.u; j+=this.prec){
				orig = math.complex(i, j);
				trans = this.func(orig);
				this.ctx.lineTo(this.xToPix(trans.re), this.yToPix(trans.im));
			}
			this.ctx.stroke();
	
	
			this.ctx.beginPath();
			orig = math.complex(i, -u/10000);
			trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			
			for(var j = -this.prec; j >= -this.u; j-=this.prec){
				orig = math.complex(i, j);
				trans = this.func(orig);
				this.ctx.lineTo(this.xToPix(trans.re), this.yToPix(trans.im));
			}
			ctx.stroke();




			this.ctx.beginPath();
			orig = math.complex(-this.u, i);
			trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			this.ctx.stroke();
	
			this.ctx.beginPath();
			orig = math.complex(this.u/10000, i);
			trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			for(var j = this.prec; j <= this.u; j+=this.prec){
				orig = math.complex(j, i);
				trans = this.func(orig);
				this.ctx.lineTo(this.xToPix(trans.re), this.yToPix(trans.im));
			}
			this.ctx.stroke();
			this.ctx.beginPath();
			orig = math.complex(-this.u/10000, i);
			trans = this.func(orig);
			this.ctx.moveTo(this.xToPix(trans.re), this.yToPix(trans.im));
			for(var j = -prec; j >= -u; j-=prec){
				orig = math.complex(j, i);
				trans = this.func(orig);
				this.ctx.lineTo(this.xToPix(trans.re), this.yToPix(trans.im));
			}
			this.ctx.stroke();
		}
	}

*/






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