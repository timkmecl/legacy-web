function Igra(w, h, ctx, best){
    this.w = w;
    this.h = h;
    this.ctx = ctx;
    this.best = best;

    this.touched = false;
    this.active = false;
    this.gameOver = false;

    ww = w*0.95; //širina igralnega polja
    hh = h;
    off = w*0.025;


    
    angle = 0;
    ovire = [-500, -500, -500, -500];

    factor = 1;

    kSize = 14;
    kRazmik = 30;
    x = 50;
    y = 0;
    yOff = 25;
    tSize = 10;
    tV23 = 5.77 // dve tretjini višine trikotnika
    tV13 = 2.89 // ena tretjina višine trikotnika

    speed = 15; //osnovna hitrost na sekundo
    speedFactor = 1;  //postopoma se zvečuje
    speedFactor2 = 1;  //za pospešek ob dotiku
    speedFaster = 2;  //faktor za pospešek ob dotiku

    angleFactor = 1;

    totalTime = 0;
    totalTotalTime = 0;


    cOzadje = ["#282828", "#bbbbbb"];
    cStene = ["#bbbbbb", "#282828"];
    cTrikotnik = ["#ffffff", "#000000"];
    cKvadrati = ["#5ffff5", "#ea0000"];
    cBest = ["#777777", "#777777"]
    cS = 0;


    this.score = 0;

    this.new = function(){
        if((ww*3)>(this.h*2)){
            ww = this.h*2/3;
            off = (this.w - ww)/2;
        }
        factor = ww/100;

        this.ctx.fillStyle="#bbbbbb";
        this.ctx.fillRect(0,0,off,hh); 
        this.ctx.fillRect(this.w - off,0,off,this.h); 
        this.generate();
    };

    this.refresh = function(time){
        if(this.active){
            time = (time<300)?time:300;
            totalTotalTime += time;
            if(!this.touched){
                totalTime+=time;
                angleFactor = (speedFactor + angleFactor*5)/6;
                angle = Math.sin((totalTime/270)*(0.75 + angleFactor/4))*0.75;
                speedFactor2 = 1;
            }else{
                speedFactor2 = speedFaster;
            }
            y += (time/1000)*speed*speedFactor*speedFactor2*Math.cos(angle);
            x += (time/1000)*speed*speedFactor*speedFactor2*Math.sin(angle)*1.1;
            speedFactor += (time/(1000*60))/speedFactor;

            if(this.score%200 >= 100){
                cS = 1;
            }else{
                cS = 0;
            }

            document.querySelector('meta[name="theme-color"]').setAttribute("content", cOzadje[cS]);
    

            
            this.ctx.fillStyle=cStene[cS];
            this.ctx.fillRect(0,0,off,this.h); 
            this.ctx.fillRect(this.w - off,0,off,this.h); 
            this.ctx.fillStyle=cOzadje[cS];
            this.ctx.fillRect(off,0,ww,this.h); 
            if(this.best > 0){
                this.ctx.fillStyle=cBest[cS];
                this.ctx.fillRect(off,hh - (kRazmik*(this.best + 4) + 8 - y)*factor,ww,1*factor); 
            }
    
            this.ctx.fillStyle=cKvadrati[cS];
            for(i = Math.max((Math.floor(y/kRazmik) + 1), 0); i <= (Math.floor(y/kRazmik) + 20); i++){
                this.ctx.fillRect(off + ovire[i]*factor,hh - (i*kRazmik - y)*factor,kSize*factor,kSize*factor); 
            }
    
            this.ctx.fillStyle=cTrikotnik[cS];
            this.drawTriangle(x*factor + off, hh - yOff*factor, 0);
            this.ctx.font = "40px Arial"
            ctx.fillText(this.score, x*factor + off - 10, hh - 20);
    
            if(this.checkCollision()){
                this.active = false;
                this.gameOver = true;
            }
            this.score = Math.max((Math.floor((y - 10)/kRazmik) - 2), 0);
        }
    };

    this.drawTriangle = function(tx, ty, a){
        this.ctx.beginPath();
        this.ctx.moveTo(tx + tV23*Math.sin(angle)*factor, ty - tV23*Math.cos(angle)*factor);
        this.ctx.lineTo(tx + tV23*Math.sin(angle + Math.PI*2/3)*factor, ty - tV23*Math.cos(angle + Math.PI*2/3)*factor);
        this.ctx.lineTo(tx + tV23*Math.sin(angle - Math.PI*2/3)*factor, ty - tV23*Math.cos(angle - Math.PI*2/3)*factor);
        this.ctx.fill();
        this.ctx.closePath();
    };

    this.checkCollision = function(){
        points = [];
        points.push([x + tV23*Math.sin(angle), y + yOff + tV23*Math.cos(angle)]);
        points.push([x + tV23*Math.sin(angle + Math.PI*2/3), y + yOff + tV23*Math.cos(angle + Math.PI*2/3)]);
        points.push([x + tV23*Math.sin(angle - Math.PI*2/3), y + yOff + tV23*Math.cos(angle - Math.PI*2/3)]);
        points.push([(points[0][0] + points[1][0])/2, (points[0][1] + points[1][1])/2]);
        points.push([(points[0][0] + points[2][0])/2, (points[0][1] + points[2][1])/2]);

        boxes = [];
        boxes.push([ovire[Math.max((Math.floor(y/kRazmik) + 1), 0)], Math.max((Math.floor(y/kRazmik) + 1), 0)*kRazmik]);
        boxes.push([ovire[Math.max((Math.floor(y/kRazmik) + 2), 0)], Math.max((Math.floor(y/kRazmik) + 2), 0)*kRazmik]);
        boxes.push([ovire[Math.max((Math.floor(y/kRazmik) + 3), 0)], Math.max((Math.floor(y/kRazmik) + 3), 0)*kRazmik]);
        collision = false;
        points.forEach(function(p){
            if(p[0] < 0 || p[0] > 100){
                collision = true;
            }
            boxes.forEach(function(b){
                if((p[0] > b[0] && p[0] < (b[0] + kSize)) && (p[1] < b[1] && p[1] > (b[1] - kSize))){
                    collision = true;
                }
            });
        });
        
        return collision;
    };



    this.generate = function(){
        for(i = 4; i < 1000; i++){
            newX = 0;
            do{
                newX = Math.random() * (100 - kSize - 6) + 3;
            }while(Math.abs(newX - ovire[i-1]) < kSize*0.8);

            ovire.push(newX);
        }
    };

    this.up = function(){
        igra.touched = false;
    }
    this.down = function(){
        igra.touched = true;
    }
}