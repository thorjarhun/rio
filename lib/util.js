const Util = module.exports = {};

const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

Util.validateEmail = email => re.test(email);

Util.validatePassword = password => R.is(String, password) && password.length > 3;
