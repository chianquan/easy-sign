'use strict';
//该测试代码放在postman的pre-request-script栏目中
//  url   http://127.0.0.1:3000/aaa
//  header   X-TOKEN    {{token}}
var time = Math.round(new Date().getTime() / 1000);
console.log('time:', time);
var apiKey = environment.signKey || 'bbb';
console.log('apiKey:', apiKey);
var url = request.url;
var path = url.replace('http://127.0.0.1:3000/', '/');
console.log('path:', path);
var data = request.method === 'GET' ? '' : request.data;
console.log('data:', '');
var method = request.method.toLowerCase();
console.log('method:', method);
if (typeof data !== 'string') {
    //数据类型为url编码
    throw new Error('data参数不是字符串');
}
if (!apiKey) {
    //apiKey 环境变量未设置
    throw new Error('apiKey参数未设置');
}
if (path.indexOf('/') !== 0) {
    //路径格式无法匹配
    throw new Error('path参数不是合法路径：' + path);
}
postman.setEnvironmentVariable("token", CryptoJS.MD5(method + '\n' + path + '\n' + data + '\n' + apiKey + '\n' + time).toString() + ',' + time);
console.log('end');