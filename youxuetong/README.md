# 油学通

> 代码已同时兼容 Surge & QuanX, 使用同一份签到脚本即可

> 目前可完成晚点名签到

## 配置 (Surge)

```properties
To be perfected...
```

## 配置 (QuanX)

```properties
[MITM]
gwxg.xsyu.edu.cn

[rewrite_local]
# 189及以前版本
^https://gwxg\.xsyu\.edu\.cn url script-response-body youxuetong_cookie.js
# 190及以后版本
^https://gwxg\.xsyu\.edu\.cn ^POST url-and-header script-request-header youxuetong_cookie.js

[task_local]
30 21 * * * youxuetong_diSign.js
```

## 说明

1. 先在小程序登录 `(先登录! 先登录! 先登录!)`
2. 先把`gwxg.xsyu.edu.cn`加到`[MITM]`
3. 再配置重写规则:
   - QuanX: 把`bilibili.cookie.js`和`bilibili.js`传到`On My iPhone - Quantumult X - Scripts` (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
4. 打开小程序
5. 系统提示: `获取Cookie: 成功`
6. 最后就可以把第 1 条脚本注释掉了
7. 请根据自己的粉丝牌数设置脚本超时时间，一个粉丝牌预计执行20s

> 第 1 条脚本是用来获取 cookie 的, 用浏览器访问一次获取 cookie 成功后就可以删掉或注释掉了, 但请确保在`登录成功`后再获取 cookie.

> 第 2 条脚本是签到脚本, 每天`00:00:10`执行一次.

