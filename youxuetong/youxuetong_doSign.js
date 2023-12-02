const cookieName = '油学通'
const zhouzhou = init()
const JWSESSION = zhouzhou.getdata('JWSESSION')
let id = ''
let signId = ''
let schoolId = ''

// 调用签到流程
performSign();

//-----------------------------------------------------------------------------------------------------------
async function performSign() {
  try {
    // 调用获取签到列表的函数
    await getSignList();

    // 如果获取签到列表成功，调用签到函数
    if (id && signId && schoolId) {
      await doSign(id, signId, schoolId);
    }
  } catch (e) {
    // 处理错误
    zhouzhou.log(`❌ ${cookieName} 签到失败: ${e}`);
  } finally {
    // 无论成功或失败都执行的代码
    zhouzhou.done();
  }
}

//-----------------------------------------------------------------------------------------------------------
function getSignList() {
  // URL and query parameters
  const url = 'https://gwxg.xsyu.edu.cn/sign/mobile/receive/getMySignLogs?page=1&size=10';
  // Headers
  const headers = {
    'Host': 'gwxg.xsyu.edu.cn',
    'Accept': 'application/json, text/plain, */*',
    'Sec-Fetch-Site': 'same-origin',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
    'Sec-Fetch-Mode': 'cors',
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.43(0x18002b2c) NetType/4G Language/zh_CN miniProgram/wx9f2d7ce09eafe921',
    'Referer': 'https://gwxg.xsyu.edu.cn/h5/mobile/sign/index/message',
    'Connection': 'keep-alive',
    'JWSESSION': JWSESSION,
    'Cookie': `JWSESSION=${JWSESSION}; JWSESSION=${JWSESSION}`,
    'Sec-Fetch-Dest': 'empty',
  };
  return new Promise((resolve, reject) => {
    const options = { url: url, headers: JSON.parse(headers) }
    zhouzhou.get(options, (error, response, data) => {
      if (error) {
        zhouzhou.log(error);
      } else {
        try {
          const result = JSON.parse(data);
          const firstEntry = result.data[0];
          if (firstEntry) {
            id = firstEntry.id;
            signId = firstEntry.signId;
            schoolId = firstEntry.schoolId;
            zhouzhou.log(`id: ${id}, schoolId: ${schoolId}, signId: ${signId}`);
          } else {
            zhouzhou.log('No entries found in the response.');
          }
        } catch (e) {
          zhouzhou.log(e);
        }
      }
    })
  })
}

//-----------------------------------------------------------------------------------------------------------
function doSign(id, signId, schoolId) {
    const url = `https://gwxg.xsyu.edu.cn/sign/mobile/receive/doSignByArea?id=${id}&schoolId=${schoolId}&signId=${signId}`;
    const headers = {
      'Host': 'gwxg.xsyu.edu.cn',
      'token': '',  // Add the necessary token value here
      'content-type': 'application/json',
      'JWSESSION': JWSESSION,
      'Accept-Encoding': 'gzip,compress,br,deflate',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.43(0x18002b2c) NetType/4G Language/zh_CN',
      'Referer': 'https://servicewechat.com/wx9f2d7ce09eafe921/2/page-frame.html'
    };
    const body= {
      "inArea": 1,
      "longitude": 108.65595947265625,
      "province": "陕西省",
      "latitude": 34.099886881510415,
      "streetcode": "5112855303129561017",
      "street": "西北销售路",
      "areaJSON": "{\"type\":0,\"circle\":{\"latitude\":\"34.1031877191\",\"longitude\":\"108.6537766457\",\"radius\":1050},\"id\":\"170002\",\"name\":\"鄠邑校区\"}",
      "citycode": "156610100",
      "city": "西安市",
      "nationcode": "156",
      "adcode": "610118",
      "district": "鄠邑区",
      "country": "中国",
      "towncode": "610118003",
      "township": "五竹街道"
    };

    return new Promise((resolve, reject) => {
      const options = { url: url, headers: JSON.parse(headers), body: JSON.parse(body)}
        zhouzhou.post(options, (err, response, data) => {
          if (err) {
            zhouzhou.log(`Error: ${err.message}`);
          } else {
            try {
              const result = JSON.parse(data);
              zhouzhou.log(JSON.stringify(result, null, 2));
              // Check if sign-in was successful
              if (result.code === 0 && result.data === '签到成功') {
                // Send success message
                zhouzhou.msg('签到成功', '签到成功！');
              } else if (result.code === 1 && result.data === '签到已结束') {
                // Send end message
                zhouzhou.msg('签到过期', '签到过期！');
              } else {
                // Log other responses for debugging
                zhouzhou.log('签到失败！', JSON.stringify(result, null, 2));
                zhouzhou.msg('签到失败！', JSON.stringify(result, null, 2));
              }
            } catch (e) {
              zhouzhou.log(`Error parsing JSON: ${e.message}`);
            }
          }
        })
    })
}

//-----------------------------------------------------------------------------------------------------------
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
