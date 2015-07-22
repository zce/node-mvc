/*
 * @Author: iceStone
 * @Date:   2015-07-19 22:09:17
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-07-19 22:22:37
 */

'use strict';
exports.getHandler = function() {
    return {
        processRequest: function(context) {
            console.log(context.routeData);
            context.response.end('hello micua');
        }
    };
};
