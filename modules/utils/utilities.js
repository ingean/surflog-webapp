export function filenameify(str) {
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

export function round(value, precision) {
  let multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function toggleActive(el) { //Argument is button to be active
  let siblings = Array.from(el.parentElement.children); //Buttom group element
  siblings.forEach(s => s.classList.remove('active'))
  el.classList.add('active')
}

export function setActiveById(id, activeValue) {
  let btns = document.querySelectorAll(`[data-toggle='${id}']`)
    if (btns) {
      btns.forEach(btn => {
        if (btn.innerText === activeValue) {
          btn.classList.remove("notActive")
          btn.classList.add("Active")
        } else {
          btn.classList.remove("Active")
          btn.classList.add("notActive")
        }
      })
    }
}

export function getStringValue(obj, key) {
  let value = ''
  try {
    let v = obj[key]
    if (v && v != 'null') {
      value = v
    }
  } finally {
    return value
  }
}