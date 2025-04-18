var inter;
var cn;

var n;
var x;

function clicked(){
	
	x=document.getElementById("xIn").value;
	n=document.getElementById("nIn").value;

	

	document.getElementById("result").innerText = calculate(x,n);
	document.getElementById("resultInt").innerText = calculateInt(x,n);

	/*for(var i = 0; i<=10; i+= 0.1){
		console.log((i + " : ") + (calculate(i, 130) - g(i)));
	}*/

	/*for(var i = 1; i<=n; i+= 1){
		console.log((i + " : ") + (calculate(x, i) - g(x)));
	}*/

	/*
				Za izpis za excel
	s=""
	for(var i = -10; i<=10; i+= 0.2){
		s+=calculate(i, n).toFixed(10) + ";" + calculateInt(i, n).toFixed(10) + "\n";
	}
	console.log(s);
	*/

	draw();
}

function calculate(x, n, silent){
	s="1/sqrt(2*pi) * (1"
	y=1/Math.sqrt(2*Math.PI);

	f2=1;
	fract = 1;
	for(var i=2; i<n*2; i+=2){

		fractNew = fract / -i;
		xx = Math.pow(x, i);
		if((fractNew==0 || !isFinite(xx)) && !silent){
			alert("Preveč, ustavljeno pri členu " + i/2);
			break;
		}
		fract = fractNew;
		f2 += fract*xx;
		
		s+= " + 1/" + 1/fract + " * " + "x**" + i;

		
	}
	y *= f2;

	s+=")"
	//console.log(s)

	return y;
}

function calculateInt(x, n, silent){
	y=1/Math.sqrt(2*Math.PI);

	fact=1;
	sum = 0;
	for(var i=0; i<=n; i+=1){
		if(i!=0){
			fact *= i;
		}

		
		toAdd = Math.pow(-1, i)*Math.pow(x, 2*i + 1) / ((2*i + 1)*Math.pow(2, i)*fact);

		if((toAdd==0 || !isFinite(toAdd)) && !silent){
			alert("Preveč, ustavljeno pri členu " + i);
			break;
		}

		sum += toAdd;
	}

	y*= sum;
	return y;
}

function g(x){
	return (1/Math.sqrt(2*Math.PI))*Math.exp(-0.5*Math.pow(x, 2));
}




function draw(){
	var c = document.getElementById("can");
	ctx = c.getContext("2d");

	cn=0;
	inter = setInterval(perFrame, 150);
}

function perFrame(){
	if(cn==n){
		ctx.clearRect(0, 0, document.getElementById("can").width, document.getElementById("can").height);
	}
	
	ctx.clearRect(0, 0, 500, 200);

	ctx.beginPath();
	ctx.moveTo(0, 300);
	for(var i = 0; i<= document.getElementById("can").clientWidth; i++){
		var xx = x*2*(i -  document.getElementById("can").clientWidth/2)/document.getElementById("can").clientWidth;
		var ggy = -calculate(xx, cn, true)*100 + 100;
		ctx.lineTo(i, ggy);
	}
	ctx.stroke();

	if(cn!=n){
		ctx.clearRect(0, 200, 500, 200);
	}

	ctx.beginPath();
	ctx.moveTo(0, 100);
	for(var i = 0; i<= document.getElementById("can").clientWidth; i++){
		var xx = x*2*(i -  document.getElementById("can").clientWidth/2)/document.getElementById("can").clientWidth;
		var giy = -calculateInt(xx, cn, true)*100 + 300;
		ctx.lineTo(i, giy);
	}
	ctx.stroke();

	if(cn < n){
		cn++
	}else{
		clearTimeout(inter);
	}
}