token="";
username="";
d_username="";
best=-1;

function tryLogin(user, pass, neww){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;

            if(response=="new"){
                if(confirm("This username doesn't yet exist. Would you like to create new account?")){
                    tryLogin(user, pass, true);
                }
            }else if(response=="wrong"){
                alert("The password for this username is wrong. Please try again or choose another username if you are trying to create a new account.")
                toggleLogin();
            }else{
                var rJSON = JSON.parse(response);
                token = rJSON.token;
                username = rJSON.user;
                d_username=rJSON.d_user;
                if(best<=rJSON.best){
                    best = rJSON.best;
                }else{
                    saveScore(best);
                }
                loggedin = true;
                toggleLogin();
            }
        }
    };
    xhttp.open("POST", "login.php", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("user=" + encodeURIComponent(user) + "&pass=" + encodeURIComponent(pass) + "&new=" + neww);
}


function logout(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "logout.php", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("user=" + encodeURIComponent(username) + "&token=" + encodeURIComponent(token));
    token="";
    username="";
    d_username="";
    best=-1;
    toggleLogin();
}


function saveScore(sscore){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if(response=="wrong"){
                token="";
                toggleLogin();
            }else{
                var rJSON = JSON.parse(response);
                best = rJSON.best;
                if(score==best){
                    getLead();
                }
            }
        }
    };
    xhttp.open("POST", "scores.php", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("user=" + encodeURIComponent(username) + "&token=" + encodeURIComponent(token) + "&score=" + sscore);
}


function getLead(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var rJSON = JSON.parse(response);
            showLead(rJSON.leaderboards);
        }
    };
    xhttp.open("POST", "leaderboards.php", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("user=" + encodeURIComponent(username));
}