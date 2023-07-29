var latestIndex = 0

export const resetLatestIndex = () => {
  latestIndex = 0
}

export const find = (values, hints) => {
  let str = ''
  
  str = findWithoutHint(values, hints)
  if (str) return
  
  str = findWithHint(values, hints)
  str = splitIfMultipart(str, hints)
  if (str) return

  return pickNextOrLast(values)
}

const findWithoutHint = (values, hints) => {
  if (!hints) {
    latestIndex++
    return values[latestIndex - 1]
  }
}

const findWithHint = (values, hints) => {
  hints.forEach(h => { 
    for (let i = latestIndex; i < values.length; i++) {
      if (values[i].includes(h)) {
        latestIndex = i
        return values[i]
      }
    }
  })
}

const pickNextOrLast = (values) => {
  let i = (latestIndex === 0) ? 0 : latestIndex + 1
  i = (i < values.length) ? i : values.length - 1
  return values[i]
}

const splitIfMultipart = (str, hints) => {
  if (!str) return
  
  if (str.includes(' ')) {
    parts = str.split(' ')
    hints.forEach(h => str = parts.find(p => p.includes(h)))
  }
  return str
}


