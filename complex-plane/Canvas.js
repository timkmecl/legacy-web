function Canvas(ctx){
	this.ctx = ctx;
	this.can;

	this.ratio;
	this.aspect;
	this.u;

	this.grids = {};
	this.gridIds = [];
	this.hiddenGrids = [];

	this.lines = {};
	this.lineIds = [];
	this.hiddenLines = [];
	
	this.points = {};
	this.pointIds = [];
	this.hiddenPoints = [];

	this.wInU;
	this.hInU;
	this.cX;
	this.cY;

	this.funct;

	this.change = function(can, u, cX, cY){
		this.can = can;
		this.u=u;
		this.cX = cX;
		this.cY = cY;

		this.canvasSetup(can);

		this.ratio = this.getRatio(can);
		this.aspect = can.height/can.width;
		
		this.wInU = u*2;
		this.hInU = u*2*this.aspect;
	}

	this.changeFunc= function(funct){
		this.funct = funct;
	}





	this.addGrid = function(id, grid){
		grid.change(grid.u, grid.center, grid.dens, grid.prec, this);
		this.grids[id]=grid;
		this.gridIds.push(id);
	}

	this.changeGrid = function(id, u,center, dens, prec){
		this.grids[id].change(u, center, dens, prec, this);
	}

	this.delGrid = function(id){
		delete this.grids[id];
		this.gridIds[this.gridIds.indexOf(id)] = undefined;
	}

	this.hideGrid = function(hide, id){
		this.hiddenGrids[id] = hide;
	}






	this.addLine = function(id, line){
		line.change(line.prec, line.length, line.angle, line.center, this);
		this.lines[id]=line;
		this.lineIds.push(id);
	}

	this.changeLine = function(id, prec, length, angle, center){
		this.lines[id].change(prec, length, angle, center, this);
	}

	this.delLine = function(id){
		delete this.lines[id];
		this.lineIds[this.lineIds.indexOf(id)] = undefined;
	}
	
	this.hideLine = function(hide, id){
		this.hiddenLines[id] = hide;
	}





	this.addPoint = function(id, point){
		point.change(point.center, this);
		this.points[id]=point;
		this.pointIds.push(id);
	}

	this.changePoint = function(id, center){
		this.points[id].change(center, this);
	}

	this.delPoint = function(id){
		delete this.points[id];
		this.pointIds[this.pointIds.indexOf(id)] = undefined;
	}
	
	this.hidePoint = function(hide, id){
		this.hiddenPoints[id] = hide;
	}






	this.draw =  function(){
		console.log("Drawing...");



		this.drawSystem();

		for(var gridId of this.gridIds){
			var grid = this.grids[gridId];
			if(grid && !this.hiddenGrids[gridId]){
				grid.draw();
			}
		}

		for(var lineId of this.lineIds){
			var line = this.lines[lineId];
			if(line && !this.hiddenLines[lineId]){
				line.draw();
			}
		}

		for(var pointId of this.pointIds){
			var point = this.points[pointId];
			if(point && !this.hiddenPoints[pointId]){
				point.draw();
			}
		}
	}
	

	this.drawSystem = function (){
		this.ctx.clearRect(0, 0, this.can.width, this.can.height);
		this.ctx.beginPath();
		this.ctx.strokeStyle = "rgba(0,0,0,0.8)"
		this.ctx.lineWidth = 2;
		this.ctx.moveTo(0, this.yToPix(0));
		this.ctx.lineTo(this.can.width, this.yToPix(0));
		this.ctx.moveTo(this.xToPix(0) , 0);
		this.ctx.lineTo(this.xToPix(0), this.can.height);
		this.ctx.stroke();
		this.ctx.lineWidth = 1;

		var intCX = this.cX - this.cX%1;
		var intCY = this.cY - this.cY%1;

		var tickLen = 5;
		
		for(var i = 0; i<=this.u+1; i++){ // for x
			//draws ticks for units
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(0,0,0,0.7)"
			this.ctx.lineWidth = 2;
			this.ctx.moveTo(this.xToPix(i + intCX), this.yToPix(0) + tickLen);
			this.ctx.lineTo(this.xToPix(i + intCX), this.yToPix(0) - tickLen);
			this.ctx.moveTo(this.xToPix(-i + intCX), this.yToPix(0) + tickLen);
			this.ctx.lineTo(this.xToPix(-i + intCX), this.yToPix(0) - tickLen);
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			
			
			//draws unit lines
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(0,0,0,0.2)"
			this.ctx.moveTo(this.xToPix(i + intCX),0);
			this.ctx.lineTo(this.xToPix(i + intCX), this.can.height);
			this.ctx.moveTo(this.xToPix(-i + intCX),0);
			this.ctx.lineTo(this.xToPix(-i + intCX), this.can.height);
			this.ctx.stroke();
		}

		for(var i = 0; i<=this.u*this.aspect; i++){ // for y
			//draws ticks for units
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(0,0,0,0.7)"
			this.ctx.lineWidth = 2;
			this.ctx.moveTo(this.xToPix(0) + tickLen, this.yToPix(i + intCY));
			this.ctx.lineTo(this.xToPix(0) - tickLen, this.yToPix(i + intCY));
			this.ctx.moveTo(this.xToPix(0) + tickLen, this.yToPix(-i + intCY));
			this.ctx.lineTo(this.xToPix(0) - tickLen, this.yToPix(-i + intCY));
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			

			//draws unit lines
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(0,0,0,0.2)"
			this.ctx.moveTo(0, this.yToPix(i + intCY));
			this.ctx.lineTo(this.can.width, this.yToPix(i + intCY));
			this.ctx.moveTo(0, this.yToPix(-i + intCY));
			this.ctx.lineTo(this.can.width, this.yToPix(-i + intCY));
			this.ctx.stroke();
		}
		
		
		this.ctx.strokeStyle = "rgba(0,0,0,0.3)"
		
	}







	this.xFromPix = function(x){
		return this.wInU*(x*this.ratio/this.can.width - 0.5) - (-this.cX);
	}
	this.yFromPix = function(x){
		return -(this.hInU*(x*this.ratio/this.can.height - 0.5) - this.cY);
	}
	
	this.xToPix = function(x){
		return ((x-this.cX)/(this.wInU) + 0.5)*this.can.width;
	}
	this.yToPix = function(x){
		return (-(x-this.cY)/(this.hInU) + 0.5)*this.can.height;
	}






	


	this.canvasSetup = function(cc){
		var ratio = this.getRatio(cc);
		
		var height = parseFloat(window.getComputedStyle(cc).height);
		var width = parseFloat(window.getComputedStyle(cc).width);
		
		cc.setAttribute("height",Math.round(height*ratio));
		cc.setAttribute("width",Math.round(width*ratio));
	}
	
	this.getRatio = function(cc){
		var bsr;
		var dpr = window.devicePixelRatio || 1,
		bsr = cc.webkitBackingStorePixelRatio ||
				cc.mozBackingStorePixelRatio ||
				cc.msBackingStorePixelRatio ||
				cc.oBackingStorePixelRatio ||
				cc.backingStorePixelRatio || 1;
	
		return dpr / bsr;
	}
}