function filenameify(str) {
  str = str.toLowerCase();
  str = str.replace(' ', '-');
  str = str.replace('æ', 'a');
  str = str.replace('ø', 'o');
  str = str.replace('å', 'a');

  return str;
}

export function getRange(ranges, value, param) {
  let obj = {};
  for (let range of ranges) {
    if (value >= range.min && value < range.max) obj = range;
  }
  return param ? obj[param] : obj;
}

export function imgSrc(value, category) {
  let filename = filenameify(value);
  return category ? `images/${category}/${filename}.png` : `images/${filename}.png`;
}
