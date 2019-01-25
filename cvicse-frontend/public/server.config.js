// 服务端配置文件
// 可以在部署或运行时改变参数，从而影响前端行为

// eslint-disable-next-line no-unused-vars
var serverConfig;

(function () {
  var baseUrl = '/api/'
  serverConfig = {
    'service.baseUrl': baseUrl,
    'service.timeout': 5000, // 请求超时时间
    'service.login.url': 'login'
  }
})()
