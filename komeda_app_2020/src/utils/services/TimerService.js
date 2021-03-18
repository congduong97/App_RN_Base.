import * as React from 'react';
let timer = React.createRef();
function clearTimer() {
  clearTimeout(timer.current);
}
const TimerService = {timer, clearTimer};
export {TimerService};
