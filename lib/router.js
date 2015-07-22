/*
 * @Author: iceStone
 * @Date:   2015-07-18 22:43:33
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-07-19 22:33:50
 */

'use strict';

/**
 * 默认路由处理程序
 * @type {[type]}
 */

var routes = exports.routes = [];

/**
 * 添加一条路由规则
 * @param  {String} url      URL模板
 * @param  {Object} defaults 路由数据默认值
 * @param  {Object} handler  路由处理程序
 * @return {Object}          添加到路由表中的路由对象
 */
exports.mapRoute = function(url, defaults, routeHandler) {
    defaults = defaults || {};
    // handler = handler || getHandler;
    var route = {
        urlTemplate: url,
        defaults: defaults,
        routeHandler: routeHandler,
        /**
         * 判断该路由对象是否匹配指定的URL
         * @param  {String} url 当前请求的Url
         * @return {Dictionary}     匹配出来的路由数据，没有匹配则返回null
         */
        match: function(url) {
            var routeData = {};
            for (var key in defaults) {
                routeData[key] = defaults[key];
            }
            url = url.startsWith('/') ? url.substr(1) : url;
            url = url.endsWith('/') ? url.substr(0, url.length - 1) : url;
            // console.log(url); OK

            var urlItems = url.split('/');
            var tmplItems = this.urlTemplate.split('/');

            for (var i = 0; i < tmplItems.length; i++) {
                var key = tmplItems[i];
                var value = urlItems[i];
                if (!(key.startsWith('{') && key.endsWith('}'))) {
                    // 不是占位符 则需要强匹配
                    if (key != value)
                        return null;
                    continue;
                }

                // 如果当前是一个占位符变量
                // key = key.replace(/[{}]/g, '');
                key = key.replace('{', '').replace('}', '');
                if (value) {
                    // 存在值的情况
                    routeData[key.replace('?', '')] = value;
                    continue;
                }
                // 没有值
                if (!key.startsWith('?') && !routeData[key]) {
                    // 既不是可选参数，也没有默认值 没有匹配
                    return null;
                }
            };
            return routeData;
        }
    };
    routes.push(route);
    return route;
};

/**
 * 路由方法
 * @param  {HttpContext} context 请求上下文
 * @return {[type]}         [description]
 */
exports.routing = function(context) {
    return routes.some(function(item) {
        var routeData = item.match(context.request.url);
        if (routeData) {
            context.routeData = routeData;
            item.routeHandler.getHandler().processRequest(context);
            return true;
        }
        return false;
    });
    // if (route) {
    //     route.handler.processRequest(context);
    // } else {
    //     context.response.writeHead(404, {
    //         'Content-Type': 'text/html'
    //     });
    //     context.response.end('<h1>Not Found</h1>');
    // }
};
