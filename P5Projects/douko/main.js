let h=0,p=0,c,lo=0
function setup() {
	c=400;
	createCanvas(windowWidth, windowHeight);
	background("0000");
	rect(0,0,400,400);
}

function draw() {
	for(i=0;i<100000;i++){
	let a = random(c);
	let b = random(c);
	point(a,b);
    let d = Math.sqrt(pow(200-a,2)+pow(b-200,2));
    if(d < 200){
		h++;
	}
	lo++;
	p=4*h/lo;
	}
	text(p,500,10+ lo/10000);
}