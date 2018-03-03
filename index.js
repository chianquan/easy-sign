/**
 * Created by sucaiquan on 2018/3/4.
 */
'use strict';
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const app = new koa();

app.use(bodyParser());

app.use(async function(ctx, next) {
    const windowTime = 10 * 60;//签名有效的窗口时间
    const signKeys = [//允许使用的签名秘钥
        'aaa',
        'bbb',
    ];
    const rawBody = ctx.request.rawBody || '';
    const method = ctx.request.method.toLowerCase();
    const path = ctx.request.url;
    const token = ctx.get('X-TOKEN');
    if (token) {
        let tmp = token.split(',');
        if (tmp.length === 2) {
            const now = Math.floor(new Date().getTime() / 1000);
            const timestamp = parseInt(tmp[1], 10);
            if (timestamp > now - windowTime && timestamp < now + windowTime) {
                for (const signKey of signKeys) {
                    if (tmp[0] === md5(`${method}\n${path}\n${rawBody}\n${signKey}\n${tmp[1]}`)) {
                        return next();
                    }
                }
            }
        }
    }
    ctx.status = 403;
    ctx.body = 'sign not match';
    return null;
});
app.use(function(ctx, next) {
    ctx.body = 'ok';
});

app.listen(process.env.PORT || 3000);