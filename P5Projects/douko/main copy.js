let a, b, probabilit, pipi;
let coprimeCount = 0;
let trials = 0;
let myFont;
function preload() {
	myFont = loadFont('./玉ねぎ楷書激無料版v7改.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(200);
	textSize(windowWidth / 10);
	textFont(myFont);
	textAlign(CENTER, CENTER);
}
  
  // ユークリッドの互除法で最大公約数を計算
function gcd(a, b) {
	while (b != 0) {
		let temp = b;
		b = a % b;
		a = temp;
	}
	return a;
}

function draw() {
	clear();
	background(255);
	fill(random()*255,random()*255,random()*255);
	stroke(random()*255);
	strokeWeight(10);
	a = int(random(1, 1000001));  // 1から100までのランダムな整数
	b = int(random(1, 1000001));
	if (gcd(a, b) == 1) {
		coprimeCount++;
	}
	trials++;
	probability = coprimeCount / trials;
	pipi = Math.sqrt(6 / probability);
	text("π: " + nf(pipi, 1, 4),windowWidth / 2, windowHeight / 2);
}
  