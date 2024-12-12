function setup() { 
  createCanvas(400, 400); 
  cursortype=[[ARROW,CROSS,HAND],[MOVE,TEXT,WAIT]]; 
  } 
  function draw() { 
  let posX;
  let posY;
  background(255,200,200);
  posX=int(mouseX / (width / 3));
  posY=int(mouseY / (height / 2));
  print(cursortype[posY][posX]); 
  cursor(cursortype[posY][posX]); 
  } 