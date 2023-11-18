# 油学通

> 代码已同时兼容 Surge & QuanX, 使用同一份签到脚本即可

> 可完成晚点名签到

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
