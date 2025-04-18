var ctx;
var mousedown = false;

var data = [];

var u = 5;
var inter;

var maxStep=50;
var expression = "sqrt(x)";

var can;

var funct;
var canv;

var lastFrameTimeMs = 0;

var animDur=5;
var inAnim = false;

var curGrid=1;
var curLine=1;
var curPoint=1;
var curParam = 1;




function start(){
	document.onkeydown = key;

	can = document.getElementById("canvas");
	ctx = can.getContext("2d")

	funct = new Function();
	canv = new Canvas(ctx);
	canv.change(can, u, 0, 0);

	canv.draw();

	//expression = window.prompt("Enter the equation: ", "x");
	expression = "x";
	values = {};
	funct.new(expression);

	canv.changeFunc(funct);

	//canv.addGrid(1, new Grid(5, 0.1));
	//canv.addLine(1, new Line(0.1, 5, 1, math.complex(1, -2)));

	//canv.draw();



	$("#functIn").change(setFDraw);
	$("#fId").click(drawIdF);
	$("#fFx").click(drawF);
	$("#fAnim").click(animF);
	$("#fAnimStep").change(function(){setF();
		window.cancelAnimationFrame(mainLoop);
		inAnim = false;
		funct.curStep = funct.maxStep*($("#fAnimStep").val()-1)/100;
		canv.draw();});

	$("#vPReIn").change(changeView);
	$("#vPImIn").change(changeView);
	$("#vSReIn").change(changeView);

	$("#add-grid").click(addGrid);
	$("#add-line").click(addLine);
	$("#add-point").click(addPoint);

	$("#add-param").click(addParam);
	$("#add-param-s").click(addParamS);
}



function func(x){
	//return math.add(math.multiply(1-i, x),math.multiply(i, funct.evaluate(x, true, 1)));
	return funct.evaluate(x, true, 1);
} 


function mainLoop(time) {
	if (!lastFrameTimeMs) {
		lastFrameTimeMs = time;
		funct.curStep = 0;
		canv.draw();
		if(inAnim){
			$("#fAnimStep").val(100*funct.curStep/funct.maxStep + 1);
			window.requestAnimationFrame(mainLoop);
		}
	} else {
		var delta = time - lastFrameTimeMs;
		lastFrameTimeMs = time;

		if (funct.curStep >= funct.maxStep) {
			funct.curStep = funct.maxStep;
			canv.draw();
			inAnim=false;
		} else {
			canv.draw();
			funct.curStep += delta / (animDur * 1000);
			if(inAnim){
				$("#fAnimStep").val(100*funct.curStep/funct.maxStep + 1);
				window.requestAnimationFrame(mainLoop);
			}
		}
	}
}

function draw(){
	canv.draw();
}


//================================================================================ FUNCTION and VIEW


function setFDraw(){
	setF();
	window.cancelAnimationFrame(mainLoop);
	canv.draw();
}

function setF(){
	expression = $("#functIn").val();
	
	if(expression){
		funct.new(expression);
	}
}

function drawIdF(){
	setF();
	window.cancelAnimationFrame(mainLoop);
	inAnim = false;
	funct.curStep=0;
	canv.draw();
	$("#fAnimStep").val(1);
}
function drawF(){
	setF();
	window.cancelAnimationFrame(mainLoop);
	inAnim = false;
	funct.curStep=funct.maxStep;
	canv.draw();
	$("#fAnimStep").val(101);
}
function animF(){
	setF();
	window.cancelAnimationFrame(mainLoop);
	inAnim = false;
	funct.curStep=0;
	lastFrameTimeMs=0;
	$("#fAnimStep").val(1);
	inAnim = true;
	window.requestAnimationFrame(mainLoop);
}





function changeView(){
	
	var cX = $("#vPReIn").val();
	var cY = $("#vPImIn").val();
	u = ($("#vSReIn").val())?$("#vSReIn").val()/2:5;

	canv.change(can, u, cX, cY);
	canv.draw();
}



//=================================================================================================== GRIDS




function addGrid(){
	var newGrid = $("#grid-0").clone();
	newId = "grid-"+curGrid;
	newGrid.attr("id", newId);

	
	$("#grid-0").after(newGrid);
	$("#" + newId).find(".grid-del").click(removeGrid);

	$("#" + newId).find(".grid-pos-re").change(changeGrid);
	$("#" + newId).find(".grid-pos-im").change(changeGrid);
	$("#" + newId).find(".grid-size").change(changeGrid);
	$("#" + newId).find(".grid-dens").change(changeGrid);
	$("#" + newId).find(".grid-prec").change(changeGrid);
	
	$("#" + newId).find(".show-grid").click(showGrid);

	canv.addGrid(curGrid, new Grid(5, 0.1, canv));

	curGrid++;

	changeGrid.call($("#" + newId).find(".grid-dens"));
}

function changeGrid(dontDraw){
	if($(this).attr("id")){
		var card = $(this);
	}else{
		var card = $(this).parent().parent().parent();
	}


	var id = card.attr("id").slice(5);
	var size = funct.parse(card.find(".grid-size").val());
	if(!size)size=10;
	var re = funct.parse(card.find(".grid-pos-re").val());
	if(!re)re=math.complex(0,0);
	var dens = funct.parse(card.find(".grid-dens").val());
	if(!dens)dens=1;
	var prec = funct.parse(card.find(".grid-prec").val());
	if(!prec)prec=0.1;

	canv.changeGrid(id, size/2, re, dens, prec);

	if(dontDraw!==true){
		canv.draw();
	}
}

function removeGrid(){
	var id = $(this).parent().parent().attr("id").slice(5);
	canv.delGrid(id);
	$(this).parent().parent().remove();

	canv.draw();
}

function showGrid(){
	var id = $(this).parent().parent().attr("id").slice(5);
	$(this).toggleClass("btn-success");
	$(this).toggleClass("btn-outline-success");
	$(this).toggleClass("notshown");

	if($(this).hasClass("notshown")){
		$(this).text("Invisible")
		canv.hideGrid(true, id);
	}else{
		$(this).text("Visible");
		canv.hideGrid(false, id);
	}
	canv.draw();
}



//=================================================================================== LINES



function addLine(){
	var newLine = $("#line-0").clone();
	newId = "line-"+curLine;
	newLine.attr("id", newId);

	
	$("#grid-0").after(newLine);
	$("#" + newId).find(".line-del").click(removeLine);

	$("#" + newId).find(".line-pos-re").change(changeLine);
	$("#" + newId).find(".line-pos-im").change(changeLine);
	$("#" + newId).find(".line-len").change(changeLine);
	$("#" + newId).find(".line-ang").change(changeLine);
	$("#" + newId).find(".line-prec").change(changeLine);
	
	$("#" + newId).find(".show-line").click(showLine);
	

	canv.addLine(curLine, new Line(0.05, 5, Math.PI/4, math.complex(0,0)));

	curLine++;

	changeLine.call($("#" + newId).find(".line-len"));
}


function changeLine(dontDraw){
	if($(this).attr("id")){
		var card = $(this);
	}else{
		var card = $(this).parent().parent().parent();
	}


	var id = card.attr("id").slice(5);
	var len = funct.parse(card.find(".line-len").val());
	if(!len && len !== 0)len=5;
	var re = funct.parse(card.find(".line-pos-re").val());
	if(!re)re=math.complex(0,0);
	var ang = funct.parse(card.find(".line-ang").val());
	if(!ang && ang !== 0)ang=Math.PI/4;
	var prec = funct.parse(card.find(".line-prec").val());
	if(!prec)prec=0.1;

	canv.changeLine(id, prec, len, ang, re);
	if(dontDraw!==true){
		canv.draw();
	}
}

function removeLine(){
	var id = $(this).parent().parent().attr("id").slice(5);
	canv.delLine(id);
	$(this).parent().parent().remove();

	canv.draw();
}


function showLine(){
	var id = $(this).parent().parent().attr("id").slice(5);
	$(this).toggleClass("btn-success");
	$(this).toggleClass("btn-outline-success");
	$(this).toggleClass("notshown");

	if($(this).hasClass("notshown")){
		$(this).text("Invisible");
		canv.hideLine(true, id)
	}else{
		$(this).text("Visible");
		canv.hideLine(false, id)
	}
	canv.draw();
}


//=================================================================================== POINTS



function addPoint(){
	var newPoint = $("#point-0").clone();
	newId = "point-"+curPoint;
	newPoint.attr("id", newId);

	
	$("#grid-0").after(newPoint);
	$("#" + newId).find(".point-del").click(removePoint);

	$("#" + newId).find(".point-pos").change(changePoint);
	$("#" + newId).find(".show-point").click(showPoint);
	

	canv.addPoint(curPoint, new Point(math.complex(0,0)));

	curPoint++;

	changePoint.call($("#" + newId).find(".point-pos"));
}



function changePoint(dontDraw){
	if($(this).attr("id")){
		var card = $(this);
	}else{
		var card = $(this).parent().parent().parent();
	}


	var id = card.attr("id").slice(6);
	var pos = funct.parse(card.find(".point-pos").val());
	if(!pos)pos=math.complex(0,0);

	canv.changePoint(id, pos);
	if(dontDraw!==true){
		canv.draw();
	}
}

function removePoint(){
	var id = $(this).parent().parent().attr("id").slice(6);
	canv.delPoint(id);
	$(this).parent().parent().remove();

	canv.draw();
}


function showPoint(){
	var id = $(this).parent().parent().attr("id").slice(6);
	$(this).toggleClass("btn-success");
	$(this).toggleClass("btn-outline-success");
	$(this).toggleClass("notshown");

	if($(this).hasClass("notshown")){
		$(this).text("Invisible");
		canv.hidePoint(true, id)
	}else{
		$(this).text("Visible");
		canv.hidePoint(false, id)
	}
	canv.draw();
}


//============================================================================= PARAMS


function addParam(){
	var newParam = $("#param-0").clone();
	newId = "param-" + curParam;
	newParam.attr("id", newId);

	
	$("#param-0").after(newParam);
	$("#" + newId).find(".param-del").click(removeParam);

	$("#" + newId).find(".param-param").change(setParam);
	$("#" + newId).find(".param-value").change(setParam);

	curParam++;

	setParam.call($("#" + newId).find(".param-param"));
}

function removeParam(){
	var id = $(this).parent().parent().attr("id").slice(6);
	var param = $(this).parent().parent().find(".param-param").val();
	funct.unset(param);
	$(this).parent().parent().remove();

	canv.draw();
}


function setParam(){
	if($(this).attr("id")){
		var card = $(this);
	}else{
		var card = $(this).parent();
	}


	var id = card.attr("id").slice(6);
	var param = card.find(".param-param").val();
	var value = funct.parse(card.find(".param-value").val());

	funct.set(param, value);

	for(var i = 1; i< curGrid; i++){
		if($("#grid-" + i).length){
			changeGrid.call($("#grid-" + i).find(".grid-dens"), true);
		}
	}
	for(var i = 1; i< curLine; i++){
		if($("#line-" + i).length){
			changeLine.call($("#line-" + i).find(".line-len"), true);
		}
	}
	for(var i = 1; i< curPoint; i++){
		if($("#point-" + i).length){
			changePoint.call($("#point-" + i).find(".point-pos"), true);
		}
	}

	canv.draw();
}

//============================================================================= SLIDER PARAMS


function addParamS(){
	var newParamS = $("#param-s-0").clone();
	newId = "param-s-" + curParam;
	newParamS.attr("id", newId);

	
	$("#param-0").after(newParamS);
	$("#" + newId).find(".param-s-del").click(removeParamS);

	$("#" + newId).find(".param-s-param").change(setParamS);
	$("#" + newId).find(".param-s-value").change(setParamS);

	$("#" + newId).find(".param-s-from").change(setParamS);
	$("#" + newId).find(".param-s-to").change(setParamS);
	$("#" + newId).find(".param-s-step").change(setParamS);

	$("#" + newId).find(".param-s-slide").change(setParamS);

	curParam++;

	setParamS.call($("#" + newId).find(".param-s-param"));
}

function removeParamS(){
	var id = $(this).parent().parent().parent().parent().attr("id").slice(8);
	var param = $(this).parent().parent().parent().parent().find(".param-s-param").val();
	funct.unset(param);
	$(this).parent().parent().parent().parent().remove();

	canv.draw();
}


function setParamS(){
	if($(this).attr("id")){
		var card = $(this);
	}else{
		var card = $(this).parent().parent().parent();
	}


	var id = card.attr("id").slice(8);
	var param = card.find(".param-s-param").val();
	var value = funct.parse(card.find(".param-s-value").val());

	var from = card.find(".param-s-from").val();
	if(!from && from !== 0)from=1;
	var to = card.find(".param-s-to").val();
	if(!to && to !== 0)to=1;
	var step = card.find(".param-s-step").val();
	if(!step && step !== 0)step=1;


	if($(this).hasClass("slider")){
		var slider = $(this);
		var value = slider.val()
		if (to > from) {
			value = (value - 1)*step + +from;
		} else {
			value = -(value - 1)*step + Math.abs(from);
		}
		card.find(".param-s-value").val(value);

	} else {
		var slider = card.find(".slider");

		slider.attr("max", (Math.abs(to - from)) / step + 1);

		if (to > from) {
			slider.val((value - from) / step + 1);
		} else {
			slider.val((Math.abs(from) - value) / step + 1);
		}
	}



	if (!$(this).hasClass("aux")) {
		funct.set(param, value);

		for (var i = 1; i < curGrid; i++) {
			if ($("#grid-" + i).length) {
				changeGrid.call($("#grid-" + i).find(".grid-dens"), true);
			}
		}
		for (var i = 1; i < curLine; i++) {
			if ($("#line-" + i).length) {
				changeLine.call($("#line-" + i).find(".line-len"), true);
			}
		}
		for (var i = 1; i < curPoint; i++) {
			if ($("#point-" + i).length) {
				changePoint.call($("#point-" + i).find(".point-pos"), true);
			}
		}

		canv.draw();
	}

}



// ========================================================================== Functions called on events

function key(event){
	if(event.key == " "){
		drawF();
	}
	if(event.key == "a"){
		animF();
	}
	if(event.key == "r"){
		drawIdF();
	}
}





function move(event){
	event.preventDefault();
	
	if(mousedown){
		var cy = canv.yFromPix((event.pageY - can.offsetTop));
		var cx = canv.xFromPix((event.pageX - can.offsetLeft));

		c= math.complex(cx, cy);

		data.push(c);
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0,0,0,0.3)"
		ctx.arc(canv.xToPix(cx), canv.yToPix(cy), 2, 0, 2*Math.PI, false);
		ctx.stroke();

		z = func(c);

		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,0,0,0.9)"
		ctx.arc(canv.xToPix(z.re), canv.yToPix(z.im), 2, 0, 2*Math.PI, false);
		ctx.stroke();
		ctx.strokeStyle = "rgba(0,0,0,0.3)"
	}
}

function clicked(cl){
	event.preventDefault();
	mousedown = cl;
}