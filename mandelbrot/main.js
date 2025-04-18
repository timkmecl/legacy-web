var resFactor = 1;
var realResFactor;
var i;
var r;
var inter;
var can;

var colorAnim;
var colorActive = false;
var colorAnimSpeed = 1;
var fps = 20;
var frames = [];
var curFrame = 0;

function start(){
    document.onkeydown = key;

    var c = document.getElementById("canvas");
    canvasSetup(c, resFactor);
    can = new Canvas();
    can.new(c.width, c.height, c.getContext("2d"), true, "4");
    can.set([-0.5, 0], [0, 0], 1, 50, 40);
    can.generate();


    i = 1;
    r = 0.5
    
    /*inter = setInterval(function(){
        can.c[0] = i - 3;
        can.c[1] = Math.cos(i*10*Math.PI) * r;
        i += 0.02;
        can.generate();
    }, 50);*/

    /*setTimeout(function(){inter = setInterval(function(){
        can.set([-0.58999, 0.4950000097235], [0, 0], i, 50*Math.log(i)+ 50, 4);
        i *= 1.5;
        can.generate();
    }, 50);}, 3000);*/

    /*setTimeout(function(){inter = setInterval(function(){
        can.c[0] = i;
        can.c[1] = Math.cos(i*5)*i/30;
        can.n[0] = -i/2;
        i -= 0.01;
        can.generate();

        if (i <= 0){
            can.c[0] = 0;
            can.c[1] = 0;
            clearInterval(inter);
        }
    }, 50)}, 500);*/
}

function changeColor(){
    if(colorActive){
        if(frames.length != fps/colorAnimSpeed){
            can.colorOff += Math.PI*2*colorAnimSpeed/fps;
            can.changeColor();
            frames[curFrame++] = can.ctx.getImageData(0,0,can.w,can.h);
        }else{
            if(curFrame >= fps/colorAnimSpeed){
                curFrame = 0;
            }
            can.ctx.putImageData(frames[curFrame++], 0, 0);
        }
        
    }
}

function clicked(left, event){
    event.preventDefault();
    var cy = (event.pageY - document.getElementById("canvas").offsetTop)*realResFactor;
    var cx = (event.pageX - document.getElementById("canvas").offsetLeft)*realResFactor;

    var x = cx*can.pxSize + can.xRazpon[0];
    var y = cy*can.pxSize + can.yRazpon[0];


    can.zoom(left, cx, cy, x, y);

    frames = [];
    curFrame = 0;
    can.generate();
}

function key(event){
    var imgData=can.ctx.getImageData(0,0,can.w,can.h);

    if(event.key != " "){
        frames = [];
        curFrame = 0;
    }
    

    if(event.keyCode == 37){ //                                                                               levo
        can.set([can.n[0] - can.w*can.pxSize/10, can.n[1]], can.c, can.r, can.maxIt, can.escape);
        can.generate();
        can.ctx.putImageData(imgData,can.w/10, 0);
    }else if(event.keyCode == 38){ //                                                                         gor
        can.set([can.n[0], can.n[1] - can.h*can.pxSize/10], can.c, can.r, can.maxIt, can.escape);
        can.generate();
        can.ctx.putImageData(imgData,0,can.h/10);
    }else if(event.keyCode == 39){ //                                                                        desno
        can.set([can.n[0] + can.w*can.pxSize/10, can.n[1]], can.c, can.r, can.maxIt, can.escape);
        can.generate();
        can.ctx.putImageData(imgData,-can.w/10, 0);
    }else if(event.keyCode == 40){ //                                                                        dol
        can.set([can.n[0], can.n[1] + can.h*can.pxSize/10], can.c, can.r, can.maxIt, can.escape); 
        can.generate();
        can.ctx.putImageData(imgData,0,-can.h/10);
    }else if(event.keyCode == 81){ //                                                                  q
        can.set(can.n, can.c,  can.r, Math.round(can.maxIt/1.5), can.escape);
        can.generate();
    }else if(event.keyCode == 69){ //                                                                  e
        can.set(can.n, can.c,  can.r, Math.round(can.maxIt*1.5), can.escape);
        can.generate();
    }else if(event.keyCode == 65){ //                                                                      a
        can.set(can.n, [can.c[0] - can.w*can.pxSize/10, can.c[1]], can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.keyCode == 87){ //                                                                      w
        can.set(can.n, [can.c[0], can.c[1] - can.h*can.pxSize/10], can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.keyCode == 68){ //                                                                      d
        can.set(can.n, [can.c[0] + can.w*can.pxSize/10, can.c[1]], can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.keyCode == 83){ //                                                                       s
        can.set(can.n, [can.c[0], can.c[1] + can.h*can.pxSize/10], can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.keyCode == 78){ //                                                                       n  ZOOMOUT
        can.zoom(false, can.w/2, can.h/2, can.n[0], can.n[1]);
        can.generate();
    }else if(event.keyCode == 77){ //                                                                       m  ZOOMIN
        can.zoom(true, can.w/2, can.h/2, can.n[0], can.n[1]);
        can.generate();
    }else if(event.key== "y"){ //                                                                       y  lower res
        resFactor /=1.5;
        var c = document.getElementById("canvas");
        canvasSetup(c, resFactor);
        can.new(c.width, c.height, can.ctx, can.inSegments, can.color);
        can.set(can.n, can.c, can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.key == "x"){ //                                                                       x  reset res
        resFactor = 1;
        var c = document.getElementById("canvas");
        canvasSetup(c, resFactor);
        can.new(c.width, c.height, can.ctx, can.inSegments, can.color);
        can.set(can.n, can.c, can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.key == "c"){ //                                                                       c  higher res
        resFactor *= 1.5;
        var c = document.getElementById("canvas");
        canvasSetup(c, resFactor);
        can.new(c.width, c.height, can.ctx, can.inSegments, can.color);
        can.set(can.n, can.c, can.r, can.maxIt, can.escape);
        can.generate();
    }else if(event.key == "v"){
        colorAnimSpeed /= 2;
    }else if(event.key == "b"){
        colorAnimSpeed *= 2;
    }else if(event.key == "g"){
        fps *= 2;
        clearInterval(colorAnim);
        colorAnim = setInterval(changeColor, 1000/fps);
    }else if(event.key == "f"){
        fps /= 2;
        clearInterval(colorAnim);
        colorAnim = setInterval(changeColor, 1000/fps);
    }else if(event.key == " "){
        if(!colorActive){
            colorActive = true;
            colorAnim = setInterval(changeColor, 1000/fps);
        }else{
            colorActive = false;
            clearInterval(colorAnim);
        }
    }else if(event.keyCode ==  13){ //                                                  ENTER
        //var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
        //window.location.download = "image.png";
        //window.location.href=image;

        //var dt = document.getElementById("canvas").toDataURL('image/png');
        //dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        //dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
        //this.location.href = dt;

        //var image = document.getElementById("canvas").toDataURL("image/png");
        //w = window.open("", '_blank');
        //w.location.href = image;

        //window.location.href = image;
        //this.download = "1";
        for(var i = 0; i < frames.length; i++){
            
        }
    }else{
        can.generate();
    }

    
    if(event.key != " " && event.keyCode != 13){
        frames = [];
        curFrame = 0;
    }
}



function canvasSetup(cc, factor){
    var ratio = getRatio(cc);
    var height = cc.clientHeight;
    var width = cc.clientWidth;
    
    realResFactor = ratio*factor;
    cc.setAttribute("height",Math.round(height*ratio*factor));
    cc.setAttribute("width",Math.round(width*ratio*factor));
}
function getRatio(cc){
    var bsr;
    var dpr = window.devicePixelRatio || 1,
    bsr = cc.webkitBackingStorePixelRatio ||
            cc.mozBackingStorePixelRatio ||
            cc.msBackingStorePixelRatio ||
            cc.oBackingStorePixelRatio ||
            cc.backingStorePixelRatio || 1;

    return dpr / bsr;
}