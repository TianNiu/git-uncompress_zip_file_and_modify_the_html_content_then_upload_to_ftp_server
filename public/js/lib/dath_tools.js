/**
 * DATH工具函数集
 * @namaspace DATH
 */
var DATH = {};
/**
 * [DATH.Event]
 * @type {Object}
 */
DATH.Event = {
    /**
     * 返回JQ事件源
     * @param  {[type]} event [js event object]
     * @return {[type]}       [JQ Target Object]
     */
    getJQTarget: function(event) {
        var target;

        if (event.target) target = event.target;
        else if (event.srcElement) target = event.srcElement;

        if (target.nodeType == 3) // defeat Safari bug
            target = target.parentNode;
        return $(target);
    }
};
