class Circle {
    constructor(x,y) {
      this.x = x
      this.y = y
    }
    draw() {
      circle(this.x, this.y, 10)
    }
  }
  
  // ここからの関数が、点の目的地を決定するための関数
  // i/lenまたはiを引数として、座標を返す
  
  function circumference(t) {
    const r = 100
    // 13は適当に64と互いに素な数で散らしている
    const theta = t * TWO_PI * 13
    const x = width / 2 + r*sin(theta)
    const y = height /2 + r*cos(theta)
    return [x,y]
  }
  
  function randomPos(t) {
    const x = random() * width
    const y = random() * height
    return [x,y]
  }
  
  // 全体の点の個数を64としてそれに依存して書いてる
  function koushi(n) {
    // 適当にシャッフルする 235は64と互いに素っぽいのを適当に選んだ
    n = (n * 235) % 64 
    
    // 8は64のsqrt
    let a = n % 8
    let b = (n-a) / 8
    const x = width/2  + (a - (8-1)/2) * 40
    const y = height/2 + (b - (8-1)/2) * 40
    return [x,y]
  }
  
  
  // ここから本編
  const len = 64;  // 正方形に並べるときを考慮して、8*8の数だけ円を用意する
  const circles = []
  function setup() {
    createCanvas(400, 400);
    
  
    const r = 100
    for(let i=0; i<len; i++) {
      circles.push( new Circle(...randomPos(i/len)))
    } 
  }
  
  function lerp2d(src, dst, t) {
    let x = src[0] * (1-t) + dst[0] * t
    let y = src[1] * (1-t) + dst[1] * t
    return [x,y]
  }
  function arcMove2d(src, dst, t) {
    const cx = (src[0] + dst[0])/2
    const cy = (src[1] + dst[1])/2
    const vx = src[0] - cx
    const vy = src[1] - cy
    const theta = t * PI
    const rotx = cos(theta)*vx - sin(theta)*vy
    const roty = sin(theta)*vx + cos(theta)*vy
    return [cx + rotx, cy + roty]
  }
  
  function draw() {
    background(220);
    randomSeed(0)
    fill(0)
    
    let time = millis() / 1000;
    time %= 3 // 全体の時間をn秒でループする
    let t = time % 1 // 小数点以下(0~1)を得て、これを使って移動する
  
    circles.forEach( (c,i) => {
      // 移動先の座標
      const cir = circumference(i/len);
      const ran = randomPos(i/len);
      const kou = koushi(i) //ここはi/lenじゃない
      
      //ここらへんも工夫すればランダムにしたり、もっと楽に書けそう
      t2 = easeInOutQuart( t ) // イージングをかけてシュッと移動します
      if(time < 1) 
        [c.x, c.y] = arcMove2d(cir,ran, t2 )
      else if(time <=2)
        [c.x, c.y] = lerp2d(ran,kou, t2)
      else if(time <=3)
        [c.x, c.y] = lerp2d(kou,cir, t2)
      else
        [c.x, c.y] = cir
      
      c.draw()
    })
  }
  
  // イージングするやつ。0~1の変化をシュッとします
  function easeInOutQuart (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }
  