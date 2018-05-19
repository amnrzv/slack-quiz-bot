exports.shuffle = function(array) {
  let new_array = [];
  let indices_array = [];
  let index = 0;
  array.forEach((element, i) => {
    index = Math.floor(Math.random() * array.length);
    while (indices_array.includes(index) || index === i) {
      index = Math.floor(Math.random() * array.length);
    }
    indices_array.push(index);
    new_array.push(array[index]);
  });
  
  return new_array;
}