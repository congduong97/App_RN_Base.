import * as React from 'react';
let permiss = React.createRef();

function getValue() {
  return permiss.current;
}

const CheckRequestPermiss = {permiss, getValue};
export {CheckRequestPermiss};
