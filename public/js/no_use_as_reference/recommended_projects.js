/**
 * 封闭空间
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
var RecommProjs = (function($) {
    /**
     * 分配到每个篮子中
     * @param  {[type]} data ajax获得json数据
     * @return {[type]}      [description]
     */
    function fullBucket(data) {
        //得到的数据总集合
        var data_collection = data;
        console.log("data is :");
        console.log(data_collection);
        //var indication = 0;
        var $limit_elements = $("[data-limit]");
        //$limit_elements
        //console.log($limit_elements.attr("data-limit"));
        $limit_elements.each(function(index, ele) {
            var limit_num = parseInt($(ele).attr("data-limit"));
            //console.log("its limit num is :" + limit_num);
            if (data_collection.length) {
                createNumsOfClone($(ele), limit_num, data_collection.splice(0, limit_num));
            }
            //indication += limit_num;
        });
    }
    /**
     * 创建新元素
     * @param  {[type]} $elem     示例元素
     * @param  {[type]} copy_num  副本总数量
     * @param  {[type]} part_json 待填充数据集合
     * @return {[type]}           [description]
     */
    function createNumsOfClone($elem, copy_num, part_json) {
        //copy_num:包含原来的一份总共要创建的份数
        console.log("element is :");
        console.log($elem);
        console.log("limit num is :");
        console.log(copy_num);
        console.log("your part json:");
        console.log(part_json);

        var $parent = $elem.parent();
        for (var i = copy_num - 1; i >= 0; i--) {
            var $copy_item = $elem.clone(true);
            $copy_item.find("img").attr("src", part_json[i].image_url);
            $copy_item.find("a").eq(0).attr("href", part_json[i].href);
            $parent.append($copy_item);
        };
        $elem.remove();
    }
    /**
     * Ajax获取项目图片地址和链接地址
     * @return {[type]} [description]
     */
    /**
     * Ajax请求获得json数据
     * @param  {[type]} initcb callback
     * @return {[type]}        [description]
     */
    function getProImgLinks(initcb) {
        var self = this;
        $.ajax({
            beforeSubmit: function() {
                //before submit do some check here
            },
            url: "/project_image_display",
            type: 'GET',
            success: fullBucket
        });
    }

    return {
        /**
         * 初始化函数
         * @return {[type]} [description]
         */
        init: function() {
            getProImgLinks(function(data) {
                console.log("ajax get the data:");
                console.log(data);
            });
        }
    };
})(jQuery);

//初始化
$(function() {
    RecommProjs.init();
});
