//文件模块
var fs = require('fs');
//日期格式化模块
var dateFormat = require('dateformat');
//推荐项目图片和链接地址json文件
var path_pro_img_links = "./config/project_img_links.json";

exports.index = function(req, res) {
    //GET     /menulist
    //res.send('menulist index');
    fs.readFile(path_pro_img_links, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var order_record_json = JSON.parse(data);
        //order_record_json.push(req.body);
        //console.log("现在的json是：");
        //console.log(order_record_json);
        res.send(order_record_json);
        // fs.writeFile(path_food_orders, order_record_json, function(err) {
        //     console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
        //     console.log(order_record_json);
        //     res.send("您的购物车请求已提交，感谢您的惠顾！！");
        // });
    });
};

exports.new = function(req, res) {
    //GET     /menulist/new
    //res.send('new menulist');
};

exports.create = function(req, res) {

};

exports.show = function(req, res) {
    //GET     /menulist/:num    num:用户名map数字
    //res.send('you request your menulist: ' + req.params.menulist);//req.params.menulist:num
    //get param username(num)

};

exports.edit = function(req, res) {
    //GET     /menulist/:num/edit
    //res.send('edit menulist ' + req.params.menulist);
};

exports.update = function(req, res) {
    //PUT     /menulist/:num
    //res.send('update menulist ' + req.params.menulist);
};

exports.destroy = function(req, res) {
    //DELETE  /menulist/:num
    //res.send('destroy menulist ' + req.params.menulist);
};
