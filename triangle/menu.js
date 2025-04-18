
score = 0;
allowed = true;
fromURL = true;
inWriting = false;

delay=25;
bottom = "auto"
exitedWithDown = false;

function resize(){
    height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.getElementById("body").clientHeight || 0);
    width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.getElementById("body").clientWidth || 0);
    off = 0;
    wwidth = width;
    if((width*3)>(height*2)){
        wwidth = height*2/3;
        off = (width - wwidth)/2;
    }
    
    document.getElementById("menu-frame").style.width = Math.round(wwidth) +"px";
    document.getElementById("menu-frame").style.height = Math.round(height) +"px";

    if(/iPhone/i.test(navigator.userAgent)) {
        //bottom = (document.getElementById("login").style.marginBottom + 44) + "px";
        //document.getElementById("login").style.marginBottom = bottom;
        //document.getElementById("logo").style.marginTop = "0px";
    }
    
    
}

function showGame(){
    fromURL = false;
    if(allowed && (exitedWithDown==false)){
        document.getElementById("menu").style.display = "none";
        document.getElementById("results").style.display = "none";
        document.getElementById("canvas").style.display = "block";

        //document.getElementsByTagName("html")[0].style.position = "fixed";
        //document.getElementsByTagName("body")[0].style.position = "fixed";
        //document.getElementsByTagName("body")[0].style.overflow = "hidden";
        onBodyResize();
        allowed = false;
        play();
    }
}

function showResults(){
    document.getElementById("canvas").style.display = "none";
    document.getElementById("results").style.display = "flex";
    
    //document.getElementsByTagName("html")[0].style.position = "unset";
    //document.getElementsByTagName("body")[0].style.position = "unset";
    //document.getElementsByTagName("body")[0].style.overflow = "unset";

    document.getElementById("score").innerHTML = score;
    document.getElementById("record").innerHTML = best;
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#5ffff5");

    if(score>best){
        best=score;
        document.getElementById("record").innerHTML = "New best!";
    }

    if(token==""){
        document.getElementById("record").innerHTML += "<br><span id='save-msg'>Log in to save progress</span>";
    }

    if(token!=""){
        saveScore(best);
    }
   
    setTimeout(function(){
        allowed = true;
    }, 300);
}

function enterLead(){
    window.history.pushState({}, "TheTriangle", [location.protocol, "//", location.host, location.pathname, "?lead"].join(''));
    document.getElementById("results").style.display = "none";
    document.getElementById("leaderboards-menu").style.display = "block";
    document.getElementById("leaderboards").style.height = (document.getElementById("leaderboards-menu").clientHeight - document.getElementById("logo-lead").clientHeight)+"px";
    
    getLead();
}

function showLead(leaderboards){
    document.getElementById("leaderboards").innerHTML="";
    for(i=0;i<leaderboards.length;i++){
        var l_item = document.createElement("div");
        var l_left = document.createElement("span");

        var l_place = document.createElement("span");
        var l_user = document.createElement("span");
        var l_score = document.createElement("span");

        l_user.innerHTML = leaderboards[i][0];
        l_score.innerHTML = Math.max(leaderboards[i][1], 0);
        l_place.innerHTML = (i+1) + ".";
        if(leaderboards[i][1]>1000){
            l_user.innerHTML += " [hacker]";
        }
        l_left.appendChild(l_place);
        l_left.appendChild(l_user);
        l_item.appendChild(l_left);
        l_item.appendChild(l_score);

        l_item.classList.add("lb_item");
        l_left.classList.add("lb_left");
        l_place.classList.add("lb_place");
        l_user.classList.add("lb_user");
        l_score.classList.add("lb_score");

        if(leaderboards[i][2] == true){
            l_item.classList.add("big");
        }

        document.getElementById("leaderboards").appendChild(l_item);
    }
}

function onLogin(){
    document.getElementById("login-btn").innerHTML = "Please wait..."
    if(token==""){
        var userr = document.getElementsByName("input-name")[0].value;
        var password = document.getElementsByName("input-pass")[0].value;
        document.getElementsByName("input-pass")[0].value = "";
        
        if(userr.length > 32 || password.length > 32){
            alert("Username and password can't be longer than 32 symbols.");
        }else if(userr.length != 0 && password.length != 0) {
            var response = tryLogin(userr, password, false);
        }
    }else{
        logout();
    }
    
}

function toggleLogin(){
    if(username==""){
        document.getElementsByName("input-name")[0].value = "";
    }else{
        document.getElementsByName("input-name")[0].value = username;
    }
    if(token==""){
        document.getElementById("input-name").style.display = "block";
        document.getElementById("input-pass").style.display = "block";
        document.getElementById("login-btn").innerHTML = "Log in / Sign up";
        //document.getElementById("login-btn-2").innerHTML = "Log in / Sign up";
        document.getElementById("login-as").style.display = "none";
    }else{
        document.getElementById("input-name").style.display = "none";
        document.getElementById("input-pass").style.display = "none";
        document.getElementById("login-btn").innerHTML = "Log out";
        //document.getElementById("login-btn-2").innerHTML = "Main Menu";
        document.getElementById("login-as").innerHTML = d_username;
        document.getElementById("login-as").style.display = "block";
    }
}

function moveToTop(up){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        if(up && inWriting==false){
            inWriting = true;

            window.scrollTo(0, 0);
            document.body.scrollTop = 0;

            document.getElementById("logo").style.display = "none";
            document.getElementById("play").style.display = "none";
            document.getElementById("login").style.marginBottom="auto";
            document.getElementById("login").style.top = "-20vh";

            window.scrollTo(0, 0);
            document.body.scrollTop = 0;

        }else{
            inWriting = false;
            setTimeout(function(){
                if(!inWriting){
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;

                    document.getElementById("logo").style.display = "block";
                    document.getElementById("play").style.display = "block";
                    document.getElementById("login").style.top = "unset";

                    document.getElementById("login").style.marginBottom = bottom;

                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                }
            }, 25);
        }
    }
    
}