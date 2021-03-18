const dayString = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];

const getTimeFomartDDMMYY = (time) => {
  if (!time) {
    return '';
  }

  const date = new Date(time);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const getDay = (time) => {
  let timeGet = getTimeFomartDDMMYY(time);
  let num = new Date(timeGet);
  let sum = num.getDay();
  let yead = num.getFullYear();
  if (yead < 9990 && sum) {
    if (dayString[sum]) {
      return dayString[sum];
    }
    return -1;
  }
  return null;
};
export {getDay};
