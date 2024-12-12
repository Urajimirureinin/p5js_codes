let img, images;
preload = function(){
  img = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Pi_%28made_by_LaTeX%29.svg/220px-Pi_%28made_by_LaTeX%29.svg.png");
}

setup = function(){
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  imageMode(CENTER);

  images = [];
  for (let i = 0; i < 5; i++) {
    images.push({ x: 0, y: 0 });
  }
}

draw = function(){
  clear();

  for (let i = 0; i < images.length; i++) {
    const cur = images[i];
    if (i === 0) {
      cur.x = mouseX;
      cur.y = mouseY;
    } else {
      const prev = images[i - 1];
      cur.x = cur.x + (prev.x - cur.x) / 10;
      cur.y = cur.y + (prev.y - cur.y) / 10;
    }

    image(img, cur.x, cur.y, img.width / 3, img.height / 3);
  }
}
