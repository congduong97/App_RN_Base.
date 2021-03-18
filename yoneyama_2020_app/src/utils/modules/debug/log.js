function log(logString, value, type) {
  let count = 60;
  let i = 0;
  let str = '';
  let z = count - logString.length;

  for (i; i <= z; i++) {
    str += '_';
    if (i === Math.floor(z / 2)) {
      str += logString;
    }
  }
  value !== undefined
    ? type === 'table'
      ? console.table(value)
      : console.log(value)
    : null;
}

export {log};
