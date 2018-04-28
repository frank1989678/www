const isMobile = str => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(str);
}

module.exports = {
  isMobile: isMobile
}
