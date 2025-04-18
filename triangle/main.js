var lastFrameTimeMs = 0;
var started = false;
var restarted = false;
var ratio = 1;



function play(){
    

    c = document.getElementById("canvas");
    getRatio(c);
    ctx = c.getContext("2d");
    //ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    
    
    started = false;
    lastFrameTimeMs = 0;

    igra = "";
    igra = new Igra(c.width,  c.height, ctx, best);
    igra.new();
    start();
}

function mainLoop(timestamp){
    if (igra.active){
        if(lastFrameTimeMs!=0){
            time = timestamp - lastFrameTimeMs;
            igra.refresh(time);
            if(igra.gameOver){
                score = igra.score;
                //if(/iPhone/i.test(navigator.userAgent)) {
                    exitedWithDown = igra.touched;
                //}
                showResults();
            }
        }
        lastFrameTimeMs=timestamp;
        requestAnimationFrame(mainLoop);
    }else{
        lastFrameTimeMs = 0;
    }
    
}


function start(){
    if(!restarted){
        window.history.pushState({}, "TheTriangle", [location.protocol, "//", location.host, location.pathname, "?game"].join(''));
    }
    started = true;
    igra.active = true;
    restarted = true;
    mainLoop(performance.now());
}

function down(event){
    
    igra.down();
}
function up(event){
    igra.up();
}

function onBodyResize(){
    c = document.getElementById("canvas");

    getRatio(c);
    
    height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.getElementById("body").clientHeight || 0);
    width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.getElementById("body").clientWidth || 0);
    
    c.setAttribute("height",Math.round(height*ratio));
    c.setAttribute("width",Math.round(width*ratio));

    c.style.width = width + "px";
    c.style.height = height + "px";

}

function getRatio(cc){
    dpr = window.devicePixelRatio || 1,
        bsr = cc.webkitBackingStorePixelRatio ||
              cc.mozBackingStorePixelRatio ||
              cc.msBackingStorePixelRatio ||
              cc.oBackingStorePixelRatio ||
              cc.backingStorePixelRatio || 1;

    ratio =  dpr / bsr;

}