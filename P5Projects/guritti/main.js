let xl,xh,yl,yh;
let sx, sy;
let save_mode = false;
let loop_mode = false;
let N = 200000;

function setup() {
  createCanvas(w=600, h=w);

  colorMode(HSB);
  background(bg=98);
  strokeWeight(0.5);
  stroke(0, 0.4);

  t=2;
}

function draw(){
  if(t==2){
    test_set_pram();
  }

  for(let i=0;i<=11000;i++){
    if(t==3){
      itr_eq();
      test_disp();
      test_res();
    }else{
      break;
   }
  }

  if(t==1){
    draw_set_pram();

    push();
    translate(w*0.5, h*0.5);
    for(let i=0;i<=N;i++){
      if(t==1){
        itr_eq();
        draw_disp();
        draw_res();
      }else{
        break;
     }
    }
    pop();

    push();
    blendMode(SOFT_LIGHT);
    fill(random(360), 70, 100);
    stroke(0,0);
    rect(0,0,w,h);
    pop();

    console.log(id);
    console.log(A);
    if(save_mode){img_save()};
    if(!loop_mode){noLoop();}
    else{redraw()};
  }
}

function test_set_pram(){
  x = y = 0.05;
  xe = x + 0.000001;
  ye = y;

  A = [];
  id = '';
  for(let i=0;i<4;i++){
    let a = int(random(4095));
    A[i] = floor(a - 2047)/800;
    id += a.toString(16).padStart(3, '0');
  }

  t = 3;
  lsum = 0;
  n = 0;
  xmin = ymin = 1000000;
  xmax = ymax = -1*xmin;
}

function itr_eq(){
  xnew = sin(A[0]*y) - cos(A[1]*x);
  ynew = sin(A[2]*x) - cos(A[3]*y);
  n = n + 1;
}

function test_disp(){
  if(n < 100 || n > 1000){}
  else{
    if(x < xmin){xmin = x;}
    if(x > xmax){xmax = x;}
    if(y < ymin){ymin = y;}
    if(y > ymax){ymax = y;}
  }
  if(n == 1000){rs_scr();}
}

function test_res(){
  cal();
  if(n > 11000){t = 1;}
  if((abs(xnew) + abs(ynew)) > 1000000){t = 2;}
  if(n > 100 && l < 0.3){t = 2;}
  x = xnew;
  y = ynew;
}

function cal(){
  xsave = xnew;
  ysave = ynew;
  x = xe;
  y = ye;
  n = n - 1;
  itr_eq();
  dlx = xnew - xsave;
  dly = ynew - ysave;
  dl2 = dlx*dlx + dly*dly;
  df = 1000000000000 * dl2;
  rs = 1 / sqrt(df);
  xe = xsave + rs*(dlx);
  ye = ysave + rs*(dly);
  xnew = xsave;
  ynew = ysave;
  lsum += log(df);
  l = 0.721347 * lsum / n;
}

function rs_scr(){
  dx = 0.1 * (xmax - xmin);
  dy = 0.1 * (ymax - ymin);
  xl = xmin - dx;
  xh = xmax + dx;
  yl = ymin - dy;
  yh = ymax + dy;

  //scale
  sx = w/(xmax - xmin)*0.8;
  sy = h/(ymax - ymin)*0.8;
  xc = xmax - 0.5 * (xmax - xmin);
  yc = ymax - 0.5 * (ymax - ymin);
}

function draw_set_pram(){
  background(bg);

  x = y = 0.05;
  xe = x + 0.000001;
  ye = y;

  t = 1;
  lsum = 0;
  n = 0;

  let sum = 0;
  for(let i=0;i<4;i++){
    sum += A[i]*10000;
  }

  randomSeed( int(sum) );
}

function draw_disp(){
  if(x > xl && x < xh && y > yl && y < yh){
    point(sx*(x-xc), sy*(y-yc));
  }
}

function draw_res(){
  cal();
  if(n > N){t = 2;}
  x = xnew;
  y = ynew;
}

function img_save() {
  save("djsa_" + id + ".png");
}