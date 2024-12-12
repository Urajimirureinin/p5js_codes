<p>
<script>
let images = [];
let numImages = 8;
let randomIndex;
let i = 1;
let img1, img2, img3, img4, img5, img11, img6, img7, img8, img9, img10;
function preload(){
  img1 = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Pi_%28made_by_LaTeX%29.svg/330px-Pi_%28made_by_LaTeX%29.svg.png");
  img2 = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Suken_sekibun.svg/24px-Suken_sekibun.svg.png");
  img3 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/f0ef2a263b86a63f20651e8cb970cd7b2230b53f");
  img4 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/423a3226e80f549c55e3873aecbf57af9296e0fd");
  img11 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/1f3492ce8a823c21000f46e64db14732db9a8cce");
  img6 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/c071c22779e2e44058024f4aad23971585b6c43e");
  img7 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/ae54517b8fe4e0d01b2736d900d8ad51e66b7e2c");
  img8 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/e936ab6caf0845374aa7e64cc8dba1a6827b8085");
  img9 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/330f259d2425c247a9ceed129de419b0e5dd893b");
  img10 = loadImage("https://wikimedia.org/api/rest_v1/media/math/render/svg/c2c9347186d37b9712189ee279666507ab12ae70");
  images = [img1, img2, img3, img4, img11, img6, img7, img8, img9, img10];
}
let camera, targets;


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('z-index', '-1');
  rectMode(CENTER);

  camera = -1;
  randomIndex = floor(random(numImages))+1;
  let img = images[randomIndex];
  targets = [];
  for (let i = 0; i < 30; i++) {
    const x = random(-width / 2, width / 2);
    const y = random(-height / 2, height / 2);
    let w = img.width * 5;
    let h = img.height * 5;
    const z = random(10, 100);
    targets.push({ x, y, w, h, z });
  }
}

function draw() {
  clear();
  translate(width / 2, height / 2);
  targets.forEach((t) => {
    t.z -= 0.1;
    if (t.z < 0) {
      t.z = 100;
    }
    const s = norm(0, camera, t.z);
    image(images[randomIndex], t.x * s, t.y * s, t.w * s, t.h * s);
  });
}
</script>
</p>