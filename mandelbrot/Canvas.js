function Canvas(){
    this.generateN = 0;

    this.new = function(w, h, ctx, inSegments, color){
        this.h = h;
        this.w = w;
        this.ctx = ctx;
        this.inSegments = inSegments;
        this.color=color;
        this.colorOff = 0;
        this.map=Array(this.w);
        

        //this.ctx.fillStyle="#333333";
        //this.ctx.fillRect(0,0,w,h); 
    };

    this.set = function(n, c, r, maxIt, escape){
        this.n = n;
        this.r = r;
        this.c = c;
        this.maxIt = maxIt;
        this.escape = escape;

        this.xRazpon = [-2/r + n[0], 2/r + n[0]];
        var ratio = this.h/this.w;
        this.yRazpon = [-2*ratio/r + n[1], 2*ratio/r + n[1]];

        this.pxSize = 4/(r*this.w);
    };


    this.changeColor = function(p){
        this.p = p;
        var img = this.ctx.createImageData(this.w, this.h);

        var off = 0;
        for(var y = 0; y < this.h; y++){
            for(var x = 0; x < this.w; x++){
                var color = this.chooseColor(this.map[x][y][1], this.maxIt, this.map[x][y][0], this.color);
                
                img.data[off++] = color[0];
                img.data[off++] = color[1];
                img.data[off++] = color[2];
                img.data[off++] = color[3];
                this.map[x][y] = [color[4], color[5]];

            }
        }
        this.ctx.putImageData(img, 0, 0);
    }

    this.generate = function(){
        this.generateN++;
        this.map = Array(this.w);
        for(var i = 0; i < this.map.length; i++){
            this.map[i] = [];
        }
        var line = this.ctx.createImageData(this.w, 1);
        var segmentNum = 100;
        var segmentSize = Math.round(this.h/segmentNum)
        /*for(var y = 0; y < this.h; y++){
            var off = 0;
            for(var x = 0; x < this.w; x++){
                var color = this.getPixel(x, y);
                line.data[off++] = color[0];
                line.data[off++] = color[1];
                line.data[off++] = color[2];
                line.data[off++] = color[3];
            }
            this.ctx.putImageData(line, 0, y);
        }*/

        generateN = this.generateN;
        for(var y = 0; y < Math.round(this.h/2) + 1; y += segmentSize){
            this.doDrawSegment(line, Math.round(this.h/2) + y, segmentSize, generateN);
            this.doDrawSegment(line, Math.round(this.h/2) - y - segmentSize, segmentSize, generateN);
        }
    };

    this.doDrawSegment = function(line, y, segmentSize, generateN){
        t = this;
        if(this.inSegments){
            setTimeout(function() {t.drawSegment(line, y, segmentSize, generateN);}, 50);
        }else{
            this.drawSegment(line, y, segmentSize, generateN);
        }
    }

    this.drawSegment = function(line, y, segmentSize, generateN){
        if(this.generateN == generateN){
            startY = y;
            for(; y < this.h && y - startY <= segmentSize  ; y++){
                var off = 0;
                for(var x = 0; x < this.w; x++){
                    var color = this.getPixel(x, y);
                    line.data[off++] = color[0];
                    line.data[off++] = color[1];
                    line.data[off++] = color[2];
                    line.data[off++] = color[3];
                    this.map[x][y] = [color[4], color[5]];
                }
                this.ctx.putImageData(line, 0, y);
            }
        }
    };

    this.getPixel = function(x, y){
        it = 1;
        var z = [x*this.pxSize + this.xRazpon[0], y*this.pxSize + this.yRazpon[0]];
        var c1 = z;
        var z = this.c;
        while((z[0]*z[0] + z[1]*z[1] < this.escape) && (it <= this.maxIt)){
            //z = this.func(z, this.c);
            z = this.func(z, c1);
            //z = this.func(z, [0,0]);  da je na tri
            //z = this.func(z, [0,0]);
            it++;
        }

        return this.chooseColor(it, this.maxIt, z, this.color);
    };

    this.func = function(z, c){
        return [z[0]*z[0] - z[1]*z[1] + c[0], 
                2*z[0]*z[1] + c[1]];
    };

    this.setColorBW = function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            color = [255, 255, 255, 255, z, it];
        }
        return color;
    };
    this.setColorGrey = function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            var temp = Math.round(255*it/maxIt); + Math.sin(this.colorOff)*100;
            //color = [temp, Math.log2(temp)*13, temp, 255];
            color = [temp, temp, temp, 255, z, it];
        }
        return color;
    };

    this.setColor = function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            var temp = Math.round(255*it/maxIt) + Math.sin(this.colorOff)*100;
            //color = [temp, Math.log2(temp)*13, temp, 255];
            color = [temp, 127 - temp/2, temp, 255, z, it];
        }
        return color;
    };

    this.smoothColorNo= function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            var temp = 20 * Math.log(2*it/maxIt)/Math.log(2);
            temp = temp/5 + this.colorOff;
            color = [(Math.sin(temp) + 1)*127, (Math.sin(temp + 2.1) + 1)*127 ,(Math.sin(temp + 4.2) + 1)*127, 255, z, it];
        }
        return color;
    };

    this.smoothColor= function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            var temp = it - Math.log(Math.log(Math.sqrt(z[0]*z[0] + z[1]*z[1])))/Math.log(2);
            temp = temp/5 + this.colorOff;
            color = [(Math.sin(temp) + 1)*127, (Math.sin(temp + 2.1) + 1)*127 ,(Math.sin(temp + 4.2) + 1)*127, 255, z, it];
        }
        return color;
    };
    this.smoothColor1= function(it, maxIt, z){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            var temp = it + 1 - Math.log(Math.log(Math.sqrt(z[0]*z[0] + z[1]*z[1])))/Math.log(2);
            temp = temp/5 + this.colorOff;
            //temp = temp/5 + Math.sin(this.colorOff);
            color = [(Math.sin(temp) + 1)*127, (Math.sin(temp + 1.5) + 1)*70 ,(Math.sin(temp*2 + 1.5) + 1)*127, 255, z, it];
            //color = [(Math.sin(temp*3 + 1.5) + 1)*127, (Math.sin(temp + 1.5) + 1)*127 ,(Math.sin(temp + 1.5) + 1)*127, 255, z, it];
            //color = [(Math.sin(temp + 1.5) + 1)*127, (Math.sin(temp + 1.7) + 1)*127 ,(Math.sin(temp + 1.3) + 1)*127, 255, z, it];
            //color = [(Math.sin(temp + 1.5))*255, (Math.sin(temp + 1.5))*255 ,(Math.sin(temp + 1.5))*255, 255, z, it];
        }
        return color;
    };

    this.smoothColor2= function(it, maxIt, z, p){
        var color;
        if(it>=maxIt){
            color = [0, 0, 0, 255, z, it];
        }else{
            //var temp = it + 1 - Math.log(Math.log(Math.sqrt(z[0]*z[0] + z[1]*z[1])))/Math.log(p[0]);
            var temp = it + 1 - Math.log(Math.log(Math.sqrt(z[0]*z[0] + z[1]*z[1])))/Math.log(2);
            temp = temp/5 + this.colorOff;
            color = [(Math.sin(temp + 1.5) + 1)*127, (Math.sin(temp + 1.7) + 1)*127 ,(Math.sin(temp + 1.3) + 1)*127, 255, z, it];
            //color = [(Math.sin(temp*p[7] + p[4]) + 1)*p[1], (Math.sin(temp*p[8] + p[5]) + 1)*p[2] ,(Math.sin(temp*p[9] + p[6]) + 1)*p[3], 255, z, it];
        }
        return color;
    };

    this.chooseColor = function(it, maxIt, z, color){
        switch (color) {
            case "0":
                return this.setColorBW(it, maxIt, z);
                break;
            case "1":
                return this.setColorGrey(it, maxIt, z);
                break;
            case "2":
                return this.setColor(it, maxIt, z);
                break;
            case "3":
                return this.smoothColorNo(it, maxIt, z);
                break;
            case "4":
                return this.smoothColor(it, maxIt, z);
                break;
            case "5":
                return this.smoothColor1(it, maxIt, z);
                break;
            case "6":
                return this.smoothColor2(it, maxIt, z);
                break;
        
            default:
                return this.setColor(it, maxIt, z);
                break;
        }
    };

    this.zoom = function(zoomIn, cx, cy, x, y){
        if(zoomIn){
        
            if(this.inSegments){
                var line = this.ctx.createImageData(this.w, 1);
                var img=this.ctx.getImageData(Math.round(cx - this.w/4),Math.round(cy - this.h/4),Math.round(this.w/2),Math.round(this.h/2));
                for(i = 0; i < this.h/2; i+=1){
                    var imgData = img.data.slice(Math.round(this.w/2)*4*i, Math.round(this.w/2)*4*(i+1));
                    for(j = 0; j < Math.round(this.w/2)*4; j+=4){
                        line.data[j*2] = imgData[j];
                        line.data[j*2+1] = imgData[j+1];
                        line.data[j*2+2] = imgData[j+2];
                        line.data[j*2+3] = imgData[j+3];
                        line.data[j*2+4] = imgData[j];
                        line.data[j*2+5] = imgData[j+1];
                        line.data[j*2+6] = imgData[j+2];
                        line.data[j*2+7] = imgData[j+3];
                    }
                    this.ctx.putImageData(line, 0, i*2);
                    this.ctx.putImageData(line, 0, i*2+1);
                }
            }   
    
    
            this.set([x, y], this.c, this.r*2, this.maxIt, this.escape);
        }else{
            
            if(this.inSegments){
                var line = this.ctx.createImageData(Math.round(this.w/2), 1);
                var img=this.ctx.getImageData(0,0,this.w,this.h);
                for(i = 0; i < this.h/2; i++){
                    var imgData = img.data.slice(this.w*4*i*2, this.w*4*(i+1)*2);
                    for(j = 0; j < this.w *2*4; j+=8){
                        line.data[j/2] = imgData[j];
                        line.data[j/2+1] = imgData[j+1];
                        line.data[j/2+2] = imgData[j+2];
                        line.data[j/2+3] = imgData[j+3];
                    }
                    this.ctx.putImageData(line, Math.round(this.w/2) - cx/2, Math.round(this.h/2) + i - cy/2);
                }
            }   
    
            this.set([x, y], this.c, this.r/2, this.maxIt, this.escape);
        }
        
    }
}