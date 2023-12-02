const cookieName = '油学通'
const cookieKey = 'zhouzhou_cookie_youxuetong'
const JWSESSIONKey = 'JWSESSION'
const JSESSIONIDKey = 'JSESSIONID'
const zhouzhou = init()
const cookieVal = $request.headers['Cookie']
let matchedOnce = false; // 新增标志变量

if (cookieVal && !matchedOnce) {
  const jsession = getCookieValue(cookieVal, JWSESSIONKey);
  if (jsession) {
    if (zhouzhou.setdata(jsession, JWSESSIONKey)) {
      zhouzhou.msg(`${cookieName}`, 'JWSESSION获取成功', `${jsession}`);
      zhouzhou.log(`[${cookieName}] JWSESSION获取成功, JWSESSION: ${jsession}`);
      matchedOnce = true; // 设置标志变量为true，表示已经成功匹配一次
      zhouzhou.done(); // 成功匹配后结束脚本执行
    }
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
