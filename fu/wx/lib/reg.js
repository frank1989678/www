const isMobile = str => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(str);
}

const isMoney = str => {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (str.split('.').length > 2) {
  	return false;
  }
  return reg.test(str);
}

module.exports = {
  isMobile: isMobile,
  isMoney: isMoney
}
