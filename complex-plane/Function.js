function Function(){
	this.parser = math.parser();
	this.expression;
	this.values = [];

	this.curStep=0;
	this.maxStep=1;


	this.new = function(expression){
		this.values={};
		this.expression = expression;
		this.parser.eval("f(x) = " + expression);
		this.parser.set("zeta", this.zeta3wrap);
	};

	this.add = function(expression){
		this.parser.eval(expression);
	};



	this.parse = function(expression){
		return this.parser.eval(expression);
	}


	


	this.set = function(param, value){
		if(param && value != undefined){
			var news = {};
			news[param]=value;
			if(value != this.parser.get(param)){
				this.values={};
			}
			
			this.parser.set(param, value);
		}
		this.parser.eval("f(x) = " + this.expression);
	}
	this.unset = function(param){
		var news = {}
		news[param]=undefined;
		this.parser.set(news);
		this.values={};
		
		this.parser.eval("f(x) = " + this.expression);
	}





	
	this.evaluate = function(x, iOverride, i){
		if(!iOverride){
			var i=this.curStep/this.maxStep
		}

		return math.add(math.multiply(1-i, x), math.multiply(i, this.trueEvaluate(x)));
	}

	this.trueEvaluate = function(x){
		this.parser.set("x", x);
		if(this.values[x.toString()]){
			return this.values[x.toString()];
		}else{
			y= this.parser.eval("f(x)");
			this.values[x.toString()] = y;
			return y;
		}
	};

	




	this.startInterpolation = function(maxStep, delay){
		this.maxStep = maxStep;
		this.inter = setInterval(this.interpolate(this), delay);
	}

	this.interpolate = function(f){return function(){
		if(f.curStep >= f.maxStep){
			clearInterval(f.inter);
		}else{
			f.curStep++
		}}
	}





















































	this.zeta3wrap = function(x){
		return zeta3(x, 5);
	};



	//                             adapted from: [bellbind: https://gist.github.com/bellbind/7ce0a9364d3d43f231b5]


var csum = function(a){
	var r = new Complex(0);
	for (var i = 0; i < a.length; i++){
		r = r.add(a[i]);
	}
	return r;s
}


var binom = function (n, k) {

    k = n - k < k ? n - k : k; // use shorter side for loop
    // use add with array for avoiding overflow by mul n*(n-1)
	//   e.g. 3C2: 1 0 0 => 1 1 0 => 1 2 1  => 1 3 3  <= result
	
    var a = new Array(k + 1);
    a[0] = 1;

    for (var i = 1; i <= k; i++) a[i] = 0;
    for (var i = 0; i < n; i++) {
        for (var j = k; j >= 1; j--) a[j] += a[j - 1];
    }
    return a[k];

};


var range = function (start, end) {

    var l = end - start;
    var a = new Array(l);
    for (var i = 0; i < l; i++) a[i] = start + i;
    return a;

};

var sign = function (k) {
    return (k % 2) ? -1 : 1;
};




var zeta3 = function (s, t) {

	t = t || 100;
	s = new Complex(s.toString());
	if (s.equals(1)) return Infinity;
	
	

    // zeta(s) = 1/(1 - 2^(1-s)) * 
    //           S(n=1..inf| 1/2^(n+1) * S(k=0..n| -1^k * C(n,k) / (k+1)^s))
    // (s != 1)

	var sn = s.neg();
	two = new Complex(2);
    var y= csum(range(0, t).map(function (n) {
        return csum(range(0, n + 1).map(function (k) {
            return (new Complex(k + 1)).pow(sn).mul(sign(k)*binom(n, k));
        })).div(two.pow(n + 1));
	})).div(two.pow(sn.add(1)).neg().add(1));

	y=math.complex(y.re, y.im);
	return y;

};
}