/*
 * @Author: iceStone
 * @Date:   2015-07-18 21:56:00
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-07-19 22:33:03
 */

'use strict';
// 工具模块
var util = require('util');
var http = require('http');
var querystring = require('querystring');

// 扩展
require('./ext.js');

var router = require('./router.js');
var mvcRouteHandler = require('./mvc-handler.js');

module.exports = function() {

    function requestListener(request, response) {
        var context = {
            request: request,
            response: response
        };
        var requestContent = '';
        context.request.on('data', function(chunk) {
            requestContent += chunk;
        }).on('end', function() {
            context.request.post = querystring.parse(requestContent);
            // 匹配路由表中的路由
            var routed = router.routing(context);
            if (!routed) {
                // 没找到
                context.response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                context.response.end('<h1>Not Found</h1>');
            }
        });
    }

    var server = http.createServer(requestListener);

    return {
        mapRoute: function(url, defaults, routeHandler) {
            routeHandler = routeHandler || mvcRouteHandler;
            router.mapRoute(url, defaults, routeHandler);
            return this;
        },
        run: function(port, hostname, callback) {
            server.listen(port, hostname, callback);
            return this;
        }
    };
}
