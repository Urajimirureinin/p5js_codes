let n = 0;

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
}

function draw() {
  background(255);
}

function coordinate(x, y, n, k1, k2, a) {
  const coFunc = new coFunc();
  const z1 = coFunc.multiply(coFunc.coexp(coFunc.complex(0, 2*PI*k1/n)),coFunc.copow(coFunc.comcos(coFunc.complex(x, y)), 2/n));
  const z2 = coFunc.multiply(coFunc.coexp(coFunc.complex(0, 2*PI*k2/n)),coFunc.copow(coFunc.comsin(coFunc.complex(x, y)), 2/n));
  return new p5.Vector(z1[0], z2[0], z1[1]*cos(a) + z2[1]*sin(a)); 
  
}

function addCalabiYau(){
  let dx = PI/10;
  let dy = PI/10;
  for(k1=0;k1<=n-1;k1++){
    for(k2=0;k2<=n-1;k++){
      for(i=0;i<=2*PI;i+=dx){
        for(j=-PI/2;j<=2*PI;j+=dy){
          plane(coordinate(i,j,n,k1,k2,a))
        }
      }
    }
  }
}

class coFunc{
  complex(a,b){
    let comp = [a,b];
    return comp;
  }

  multiply(a,b){
    let re = a[0]*b[0]-a[1]*b[1];
    let im = a[0]*b[1]+a[1]*b[0];
    let comp = [re, im];
    return comp;
  }

  coexp(a){
    let im = exp(a[0])*cos(a[1]);
    let re = exp(a[0])*sin(a[1]);
    let comp = [re, im];
    return comp;
  }

  comsin(a){
    let z = [-a[1],a[0]];
    let iz = [a[1],-a[0]];
    let e = this.coexp(z);
    let ee = this.coexp(iz);
    let im = e[1]/2-ee[1]/2;
    let re = e[0]/2-ee[0]/2;
    let comp = [re, im];
    return comp;
  }

  comcos(a){
    let z = [-a[1],a[0]];
    let iz = [a[1],-a[0]];
    let e = this.coexp(z);
    let ee = this.coexp(iz);
    let im = e[1]/2+ee[1]/2;
    let re = ee[0]/2+e[0]/2;
    let comp = [re, im];
    return comp;
  }

  Log(a){
    let re = log(sqrt(a[1]^2+a[0]^2));
    let im = atan(a[1]/a[0]);
    let comp = [re, im];
    return comp;
  }

  copow(a,b){
    let te = this.coexp(this.multiply(b, this.Log(a)));
    return te;
  }
}