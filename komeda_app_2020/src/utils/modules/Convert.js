const Convert = {
  removeHTMLTag: (string) => {
    const regex = /(<([^>]+)>)/gi;
    string = string.replace(/&nbsp(?:;?)/gi, ' ');
    return string.replace(regex, '');
  },
  remove: (array, key, value) => {
    //remove an item in array got key and key's value.
    //Ex: const newData = remove(data, "id", "88");
    const index = array.findIndex((obj) => obj[key] === value);
    let newArray =
      index >= 0
        ? [...array.slice(0, index), ...array.slice(index + 1)]
        : array; //remove item
    return newArray;
  },
  chunkArray: (myArray, chunk_size) => {
    var results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  },
};

export {Convert};
