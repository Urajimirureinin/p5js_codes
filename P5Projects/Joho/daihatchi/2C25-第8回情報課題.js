let x; //円の中心のx座標 
let y; //円の中心のy座標 
let dx=10.0; //x方向移動量 
let dy=10.0; //y方向移動量 
 
function setup() { 
  createCanvas(600, 600); 
  //はじめの円の位置を乱数で決める 
  x= random(15,width-15); 
  y= random(15, height-15);   
} 
 
function draw() { 
  background(0); //画面を黒く初期化 
  
  fill("#E91E63")
  
  //位置を更新 
  x+=dx; 
  y+=dy; 
   
  //キャンバスの隅に到達した場合方向を変える 
  if ((x<15 || x >width - 15))  dx=-dx; 
  if (y<15 || y > height - 15)  dy=-dy; 
  //直径30ピクセルの円を描画 
  ellipse(x, y, 30, 30); 
} 
