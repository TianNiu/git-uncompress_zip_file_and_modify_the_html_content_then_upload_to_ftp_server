//文件模块
var fs = require('fs');
//日期格式化模块
var dateFormat = require('dateformat');
//推荐项目图片和链接地址json文件
var path_pro_img_links = "./config/project_img_links.json";

exports.main = function(req, res) {
    //GET     /menulist
    //res.send('menulist index');
    var num_limit = 0;
    //如果有limit参数，就设置成limit的数值
    //console.log("the limit");
    //console.log(req.query.num_limit);
    if (req.query.num_limit) {
        num_limit = req.query.num_limit;
    }
    fs.readFile(path_pro_img_links, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var json_pro_imglinks = JSON.parse(data);
        if (num_limit) {
            json_pro_imglinks.length = parseInt(num_limit);
        }
        //console.log("run here");
        //console.log(json_pro_imglinks);
        //json_pro_imglinks.push(req.body);
        //console.log("现在的json是：");
        //console.log(json_pro_imglinks);
        res.send(json_pro_imglinks);
        // fs.writeFile(path_food_orders, json_pro_imglinks, function(err) {
        //     console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
        //     console.log(json_pro_imglinks);
        //     res.send("您的购物车请求已提交，感谢您的惠顾！！");
        // });
    });
};
