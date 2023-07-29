export const getFirstFloatFromString = (str) => {
  return Number(str.match(/[-+]?\d*[.,]\d+|\d+/)?.[0])
}

export const getFirstIntFromString = (str) => {
  return Number(str.match(/\d+/)?.[0])
}

export const getStrPart = (str, separator, i) => {
  if (!separator) return str
  
  let s = str.split(separator)
  if (i <= s.length - 1) {
    return s[i]
  } else {
    return s[s.length - 1]
  }
}

export const UFirst = (str) => {
  str = str.toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}