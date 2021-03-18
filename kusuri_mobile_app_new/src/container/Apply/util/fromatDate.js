export const getTimeFomartDDMMYY = (time) => {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };
