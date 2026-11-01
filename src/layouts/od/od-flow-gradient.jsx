'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
// Degradado «flow» animado (como el Flow del Gradient Builder de Feral): ruido
// con deformación de dominio en un shader WebGL, coloreado con una rampa de
// hasta 5 colores, que se mueve lento. Se dibuja a media resolución (es todo
// suave), se pausa fuera de pantalla y con movimiento reducido queda quieto.
// Sin WebGL: un degradado CSS con los mismos colores.
// ----------------------------------------------------------------------

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// simplex 2D (Ashima Arts / Ian McEwan, MIT) + fbm + rampa de color
const FRAG = `
precision mediump float;
uniform vec2 res;uniform float t;uniform vec3 c[5];uniform float speed;uniform float scale;
vec3 perm(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float sn(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=x0.x>x0.y?vec2(1.,0.):vec2(0.,1.);
vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
vec3 pm=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;
vec3 x=2.*fract(pm*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<2;i++){v+=a*sn(p);p*=2.02;a*=.5;}return v;}
vec3 ramp(float x){x=clamp(x,0.,1.)*4.;
if(x<1.)return mix(c[0],c[1],x);if(x<2.)return mix(c[1],c[2],x-1.);
if(x<3.)return mix(c[2],c[3],x-2.);return mix(c[3],c[4],x-3.);}
void main(){vec2 uv=gl_FragCoord.xy/res;vec2 p=(uv-.5)*vec2(res.x/res.y,1.)*scale;float s=t*speed;
vec2 q=vec2(fbm(p+vec2(0.,s)),fbm(p+vec2(5.2,1.3)-s*.8));
float n=fbm(p+.9*q+vec2(s*.3,-s*.2));
gl_FragColor=vec4(ramp(smoothstep(-.6,.6,n)),1.);}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export function OdFlowGradient({ colors, speed = 0.06, scale = 0.42, sx }) {
  const ref = useRef(null);
  const key = colors.join();

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const pal = [...colors, ...Array(5).fill(colors[colors.length - 1])].slice(0, 5);
    gl.uniform3fv(gl.getUniformLocation(prog, 'c'), new Float32Array(pal.flatMap(hex)));
    gl.uniform1f(gl.getUniformLocation(prog, 'speed'), speed);
    gl.uniform1f(gl.getUniformLocation(prog, 'scale'), scale);
    const uRes = gl.getUniformLocation(prog, 'res');
    const uT = gl.getUniformLocation(prog, 't');

    // ponytail: media resolución fija; subir el factor si se nota borroso
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * 0.5));
      const h = Math.max(1, Math.round(canvas.clientHeight * 0.5));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    let raf = 0;
    let visible = false;
    const t0 = performance.now() - 20000; // arranca ya «revuelto»
    const draw = (now) => {
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    draw(performance.now());

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
    // colors va por `key` (un arreglo nuevo en cada render no debe reiniciar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, speed, scale]);

  return (
    <Box
      ref={ref}
      component="canvas"
      aria-hidden
      sx={[{ display: 'block', width: 1, height: 1, background: `linear-gradient(160deg, ${colors.join(', ')})` }, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
