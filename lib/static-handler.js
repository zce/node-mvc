/*
 * @Author: iceStone
 * @Date:   2015-07-18 22:39:07
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-07-19 22:22:22
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
