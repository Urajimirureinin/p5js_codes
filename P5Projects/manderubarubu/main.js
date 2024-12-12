let timer=0

function setup() 
{
	createCanvas(2016, 3840,WEBGL);
	background(100);
}

function draw() 
{
	rotateX(timer/90)
	rotateY(timer/20)
	rotateZ(timer/90)
	timer++
	for(x=-50;x<50;x++)//creates grid - X axis coordinates
	{
		for(y=-50;y<50;y++)//creates grid - Y axis coordinates
		{
			push()
			for(z=0;z<10;z++)
			{
				translate(x*20,y*20,0)
			}
			if(timer%10==0 && timer<61) //creates spheres
			{
				 if(x==0 & y==0) stroke(random(255),random(255),random(255),200)
				 else if(x==0 & y==1 & timer<30) stroke(random(255),random(255),random(255),200)
				 else if(x==0 & y==-1 & timer<30) stroke(random(255),random(255),random(255),200)
				 else stroke(0)
                 rotateZ(random(-20,20))
                 torus(random(25),random(10))
			}
			else if(timer>=61 && timer<77) //creates touch of light at top right corner at end of sketch
			{
				stroke(random(255),20)
				noFill()
				translate(200,100,-500)
				strokeWeight(.5)
				for(i=0;i<3;i++)
				{
					rotateX(timer*4)
					box(x*15,-900+x*15,10)
				}
			}
			else if(timer<77) //creates giant circles/rings around the spheres
			{
			 if(x==0&y==0) stroke(random(255),random(255),random(255),200)
			 else if(x==0 & y==1 & timer<30) stroke(random(255),random(255),random(255),200)
			 else if(x==0 & y==-1 & timer<30) stroke(random(255),random(255),random(255),200)
			 else stroke(0)
			 strokeWeight(.5);
			 noFill();
			 circle(0,0,200)
			}
			pop()
		}
	}
}