let num_max = 100; //発散判定のループ回数最大値
let divergence_max = 200; //発散したとみなす基準値

function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(0);
  translate(width/2, height/2); //座標原点を中央に
  scale(width/4, height/4); //座標を-2~2の範囲に
  let xp = 4/width; //ループ1回毎に加算する値(横x軸)
  let yp = 4/height; //ループ1回毎に加算する値(縦y軸)
  noStroke();
  for(let x=-2; x<=2+xp; x+=xp){
    for(let y=-2; y<=2+yp; y+=yp){
      let num = a(x, y); //発散判定
      if(num!=num_max) continue; //発散しなかった場合点を打たない
      num = map(num, 0, num_max, 0, 360, true) //発散の速さに応じて色を変える
      fill(num,100,100);
      rect(x, y, xp, yp);
    }
  }
}

function a(a,b){
  let n;
  let r = a;
  let i = b;
  for(n=1; n<num_max; n++){
    if(dist(0,0,r,i) > divergence_max) return n;
    let r_tmp = r;
    let i_tmp = i;
    let theta = Math.atan(i/r)
    r = pow(Math.sqrt(pow(r,2)+pow(i,2)),r)*Math.exp(-1*i_tmp*theta)*Math.cos(r*theta+i*Math.log(Math.sqrt(pow(r,2)+pow(i,2))));
    i = pow(Math.sqrt(pow(r,2)+pow(i,2)),r)*Math.exp(-1*i_tmp*theta)*Math.sin(r*theta+i*Math.log(Math.sqrt(pow(r,2)+pow(i,2))));
  }
  return n;
}