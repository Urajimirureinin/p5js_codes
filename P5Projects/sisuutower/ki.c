#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// color stuff
void hue2rgb(int hue, int vmax, int *r, int *g, int *b)
{
    int *max = r;
    int *p1 = g;
    int *p2 = b;

    int h0 = hue + 60;
    if (h0 >= 360)
        h0 -= 360;

    if (h0 >= 240)
    {
        max = b;
        p1 = r;
        p2 = g;
        h0 -= 240;
    }
    else if (h0 >= 120)
    {
        max = g;
        p1 = b;
        p2 = r;
        h0 -= 120;
    }

    *max = vmax;
    if (h0 < 60)
    {
        *p1 = 0;
        *p2 = (int)(vmax * (60 - h0) / 60);
    }
    else
    {
        *p2 = 0;
        *p1 = (int)(vmax * (h0 - 60) / 60);
    }
}

// complex op. iz=1/z
void cinv(double zr, double zi, double *izr, double *izi)
{
    double r2 = zr * zr + zi * zi;
    *izr = zr / r2;
    *izi = -zi / r2;
}

// newZ = exp(a z)
void ite(double ar, double ai, double zr, double zi, double *nzr, double *nzi)
{
    double logr = ar * zr - ai * zi;
    double th = ar * zi + ai * zr;
    *nzr = exp(logr) * cos(th);
    *nzi = exp(logr) * sin(th);
}

// solve f(z)=exp(az)-z =0
void newton(double ar, double ai, double *zr0, double *zi0)
{

    // initial val
    double zr, zi;

    zr = *zr0;
    zi = *zi0;

    int i;
    for (i = 0; i < 1000; i++)
    {
        // exp(az)
        double exr, exi;
        ite(ar, ai, zr, zi, &exr, &exi);

        // f(z)=exp(az)-z
        double fr = exr - zr;
        double fi = exi - zi;

        // df/dz= a exp(az)-1
        double dfr = exr * ar - exi * ai - 1.0;
        double dfi = exr * ai + exi * ar;

        // t=1/(a exp(az)-1)
        double tr, ti;
        cinv(dfr, dfi, &tr, &ti);

        // f*t
        double dzr = fr * tr - fi * ti;
        double dzi = fr * ti + fi * tr;

        double r2 = dzr * dzr + dzi * dzi;
        if (r2 < 1e-20)
            break;
        zr -= dzr;
        zi -= dzi;
    }

    *zr0 = zr;
    *zi0 = zi;
}

int main(int argc, char **argv)
{
    FILE *fp;

    double lmax = 10.0;
    double r2max = 1e+20;
    int div = 800;

    int x, y, c;
    char *buf = (char *)malloc(div * div * 3);

    int cmax = 3600;
    double *xtab = (double *)malloc(cmax * sizeof(double));
    double *ytab = (double *)malloc(cmax * sizeof(double));

    for (x = 0; x < div; x++)
    {
        for (y = 0; y < div; y++)
        {

            int c;
            int r, g, b;
            char *p = &buf[(x + y * div) * 3];
#if 0
	    double da= x*lmax*2/div -lmax;
	    double db= y*lmax*2/div -lmax;
	    double x0=0;
	    double y0=0;
#else
            double x0 = x * lmax * 2 / div - lmax;
            double y0 = y * lmax * 2 / div - lmax;
            double da = log(x0 * x0 + y0 * y0) / 2; // logR
            double db = atan2(y0, x0);
#endif

            //	printf("%e %e\n",cr,ci);
            for (c = 0; c < cmax; c++)
            {
                xtab[c] = x0;
                ytab[c] = y0;

                // check periodic convergence
                int p;
                int done = 0;
#define PMAX 37
                for (p = 1; p <= PMAX; p++)
                {
                    if (c - p < 0)
                        break;
                    double dx = x0 - xtab[c - p];
                    double dy = y0 - ytab[c - p];
                    double rr = dx * dx + dy * dy;
                    if (rr < 1e-30)
                    {
                        // use 12 colors
                        p = (p - 1) % 12;
                        // hue2rgb((c*180/cmax)%180, 255, &r, &g, &b);
                        hue2rgb(p * 180 / 12, 255, &r, &g, &b);
                        done = 1;
                        break;
                    }
                }
                if (done == 1)
                    break;

                double nx, ny;
                ite(da, db, x0, y0, &nx, &ny);

                // diverge?
                if (nx * nx + ny * ny > r2max)
                {
                    // hue2rgb(180+(c*5)%180, 128, &r, &g, &b);
                    r = g = b = 0;
                    break;
                }
                x0 = nx;
                y0 = ny;
            }

            // neither converge or diverge
            if (c == cmax)
                r = g = b = 128;

            // put
            p[0] = r;
            p[1] = g;
            p[2] = b;
        }
    } // xy

    // axis
    for (x = 0; x < div; x++)
    {
        char *p = &buf[(x + div / 2 * div) * 3];
        p[0] = p[1] = p[2] = 0;
        p = &buf[(div / 2 + x * div) * 3];
        p[0] = p[1] = p[2] = 0;
    }

    fp = fopen("a.ppm", "w");
    fprintf(fp, "P6\n%d %d\n255\n", div, div);
    fwrite(buf, 1, 3 * div * div, fp);
    fclose(fp);
    free(xtab);
    free(ytab);
}