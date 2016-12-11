function stringTemplate(template, context) {
  if (typeof template !== 'string') {
    return ''
  }

  if (typeof context !== 'object') {
    context = {}
  }

  let start = null
  let result = ''
  let tmp = ''
  for (let i = 0; i < template.length; i++) {
    const char = template[i]
    if (char === '[') {
      start = true
    } else if (char === ']') {
      if (start === null) {
        throw new Error('Start with close bracket.')
      }

      if (!context[tmp]) {
        throw new Error('The context "' + tmp + '" is not defined.')
      }
      result += context[tmp]
      start = null
      tmp = ''
    } else if (start) {
      if (i === template.length - 1) {
        throw new Error('Uncompleted bracket.')
      } else {
        tmp += char
      }
    } else {
      result += char
    }
  }

  return result
}

module.exports = stringTemplate
