const fromHSV = hsv => {

  var h, s, v, r, g, b, i, f, p, q, t;

  h = hsv.h / 360; s = hsv.s / 100; v = hsv.v / 100;
  i = Math.floor( h * 6 );

  f = h * 6 - i;
  p = v * ( 1 - s );
  q = v * ( 1 - f * s );
  t = v * ( 1 - ( 1 - f ) * s );
  switch (Math.abs(i) % 6 ) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
  }

  return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
};

export default fromHSV;
