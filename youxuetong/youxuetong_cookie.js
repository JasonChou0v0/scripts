const cookieName = '油学通'
const cookieKey = 'zhouzhou_cookie_youxuetong'
const JWSESSIONKey = 'JWSESSION'
const JSESSIONIDKey = 'JSESSIONID'
const zhouzhou = init()
const cookieVal = $request.headers['Cookie']
//zhouzhou.log(JSON.stringify(headers, null, 2)); 可以获取整个headers，进行格式化输出
if (cookieVal) {
  zhouzhou.msg(`${cookieName}`, '获取Cookie: 成功', '');
  const jsession = getCookieValue(cookieVal, JWSESSIONKey);
  const jsessionid = getCookieValue(cookieVal, JSESSIONIDKey);
  if (zhouzhou.setdata(jsession, JWSESSIONKey);) {
    zhouzhou.msg(`${cookieName}`, 'JWSESSION获取成功', '');
    zhouzhou.log(`[${cookieName}] JWSESSION获取成功, JWSESSION: ${jsession}`);
  }
  if (zhouzhou.setdata(jsessionid, JSESSIONIDKey);) {
    zhouzhou.msg(`${cookieName}`, 'JSESSIONID获取成功', '');
    zhouzhou.log(`[${cookieName}] JSESSIONID获取成功, JSESSIONID: ${jsessionid}`);
  }
}
function getCookieValue(cookieString, cookieKey) {
  const regex = new RegExp(`${cookieKey}=([^;]+)`);
  const matches = cookieString.match(regex);
  return matches ? matches[1] : null;
}
function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
zhouzhou.done()
