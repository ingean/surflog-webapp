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

export function toggleActiveBtn(activeBtn) { //Argument is button to be active
  let allBtns = Array.from(activeBtn.parentElement.children); //Buttom group element
  allBtns.forEach(btn => {
    btn.classList.remove('Active')
    btn.classList.add('notActive')
  })
  activeBtn.classList.remove('notActive')
  activeBtn.classList.add('Active')
}

export function setActiveById(id, activeValue) {
  let btns = document.querySelectorAll(`[data-toggle='${id}']`)
    if (btns) {
      btns.forEach(btn => {
        if (btn.getAttribute('data-title') === activeValue) {
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

export const tideParts = (t) => {
  let sign = (t.includes('-')) ? "-" : (t.includes('+')) ? "+" : null
  let p =  {
    type: t.substr(0,t.indexOf(' ')),
    sign: sign,
    beforeAfter: (sign === '-') ? 'før' : 'etter',
    hours: Number(t.match(/\d+/)?.[0]),
    phase: t.substring(t.indexOf('(') + 1 , t.indexOf(')')),
  } 
  p.direction = ((p.type === 'Lavvann' && p.sign !== '-') || (p.type === 'Høyvann' && (p.sign === '-' || p.sign == null))) ? 'stigende' : 'synkende'   
  p.id = `${filenameify(p.type)}_${p.direction}${(p.hours ? p.hours : '')}`
  return p
}

export const copyObject = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const minMaxValues = (obj) => {
  let max = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b)
  let min = Object.keys(obj).reduce((a, b) => obj[a] < obj[b] ?  a : b)
  
  return {
    min: {key: min, value: obj[min]},
    max: {key: max, value: obj[max]}
  }
}

export const maxObj = (arr, key) => {
  arr = arr.filter(o => o[key]) //
  return arr.reduce((prev, current) => {
    return (prev[key] > current[key]) ? prev : current
  })
}

export const minObj = (arr, key) => {
  arr = arr.filter(o => o[key]) //
  return arr.reduce((prev, current) => {
    return (prev[key] < current[key]) ? prev : current
  })
}

export const mergeTimeseries = (arr) => {
  let i = findLongestTimeserie(arr, 'data')
  
  let result = []
  arr[i].data.forEach(ts => {
    let timestep = {utctime: ts.utctime}
    arr.forEach(station => {
      let data = station.data.find(s => s.utctime === ts.utctime)
      if (data) timestep[station.name] = data
    })
    result.push(timestep)
  })
  return result
}

export const findLongestTimeserie = (arr, key) => {
  const result = arr.reduce((acc, obj, index) => {
    const currentLength = obj[key].length
    if (currentLength > acc.maxLength) {
      return { maxLength: currentLength, maxIndex: index }
    } else {
      return acc
    }
  }, { maxLength: -1, maxIndex: 0 })
  return result.maxIndex
}

export const toChunks = (arr, chunkSize) => {
  chunkSize = chunkSize || 4
  const chunks = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks
}

