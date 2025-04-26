const padZero = (value, pad = 2) => value.toString().padStart(pad, '0');

module.exports = {
  formatDate: (value, format = 'dd/MM/yyyy') => {
    const date = new Date(value)

    const formatTokens = {
      'yyyy': () => date.getFullYear().toString(),
      'MM': () => padZero(date.getMonth() + 1),
      'dd': () => padZero(date.getDate()),
      'HH': () => padZero(date.getHours()),
      'mm': () => padZero(date.getMinutes()),
      'ss': () => padZero(date.getSeconds()),
      'fff': () => padZero(date.getMilliseconds(), 3),
    };

    let formattedDate = format;

    for (const key in formatTokens) {
      if (format.includes(key)) {
        formattedDate = formattedDate.replace(key, formatTokens[key]())
      }
    }

    return formattedDate;
  }
}