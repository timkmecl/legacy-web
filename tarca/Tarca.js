function Tarca(x, y, r, vx, vy, maxx, maxy, ctx, speedF, minSizeF, maxSizeF) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
    this.maxx = maxx;
    this.maxy = maxy;
    this.ctx = ctx;
    this.speedF = speedF;
    this.minSizeF = minSizeF;
    this.maxSizeF = maxSizeF;
    this.new = function(){
        this.r = ((Math.random()*(this.maxSizeF-this.minSizeF)/2) + this.minSizeF)*(0.5 + 0.5*(this.maxx*this.maxy)/969566);
        this.x = Math.random()*(this.maxx-2*this.r) + this.r;
        this.y = Math.random()*(this.maxy-2*this.r) + this.r;
        this.vx = (Math.random()*200 - 100)*(this.maxx/1280)*(this.r/(0.5 + 0.5*(this.maxx*this.maxy)/969566)/100)*(this.speedF/100)*3;
        this.vy = (Math.random()*200 - 100)*(this.maxy/1280)*(this.r/(0.5 + 0.5*(this.maxx*this.maxy)/969566)/100)*(this.speedF/100)*3;
    };
    this.clicked = function(cx, cy){
        if((Math.pow(this.x - cx, 2) + Math.pow(this.y - cy, 2)) <= Math.pow(this.r, 2)){
            return 1;
        }else{
            return 0;
        }
    };
    this.recalculate = function(oldTime, newTime){
        this.erase(this.ctx);
        this.x = this.x + this.vx*((newTime - oldTime)/1000);
        this.y = this.y + this.vy*((newTime - oldTime)/1000);
        this.draw(this.ctx);
        if((this.x > this.maxx + this.r) || (this.y > this.maxy + this.r) || (this.x < 0-this.r) || (this.y < 0-this.r)){
            this.erase(this.ctx);
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(0,0,maxx,maxy); 
            this.new();
            return false;
        }else{
            return true;
        }
    };
    this.erase = function(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r+1,0,2*Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "white"
        ctx.stroke();
    }
    this.draw = function(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 0;
         ctx.strokeStyle = "red"
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r*4/5,0,2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "red"
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r*3/5,0,2*Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "red"
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r*2/5,0,2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "red"
        ctx.stroke();
    
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r/5,0,2*Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = "red"
        ctx.stroke();
    }
}    