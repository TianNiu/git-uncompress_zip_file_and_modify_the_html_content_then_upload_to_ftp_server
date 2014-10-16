//文件模块
var fs = require('fs');
//日期格式化模块
var dateFormat = require('dateformat');
//菜单存放在config下得record.json文件中 menu.json
var path_menulist = "./config/menulist.json";
//result结果文件夹中  food_orders.json:保存用户订单
var path_food_orders = "./result/food_orders.json";
/*

              ##
###            #
 #             #
 #  ####    ####   ##  ## ##
 #   #  #  #   #  #  #  # #
 #   #  #  #   #  ####   #
 #   #  #  #  ##  #     # #
### ### ##  ## ##  ### ## ##


 */
exports.index = function(req, res) {
    //GET     /orderlist
    //res.send('orderlist index');
    fs.readFile(path_food_orders, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var order_record_json = JSON.parse(data);
        //order_record_json.push(req.body);
        //console.log("现在的json是：");
        console.log("now i get the json:");
        console.log(order_record_json);
        res.send(order_record_json);
        // fs.writeFile(path_food_orders, order_record_json, function(err) {
        //     console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
        //     console.log(order_record_json);
        //     res.send("您的购物车请求已提交，感谢您的惠顾！！");
        // });
    });
};

exports.new = function(req, res) {
    //GET     /orderlist/new
    res.send('new orderlist');
};
/*


  ####
 #   #                 #
#      ## #  ##  ###  ###   ##
#       ##  #  # #  #  #   #  #
#       #   ####  ###  #   ####
 #   #  #   #    #  #  #   #
  ###  ###   ### ####   ##  ###


 */
exports.create = function(req, res) {
    //POST    /orderlist
    //res.send('create orderlist');
    /*req.query look like below, 原本就是json格式
         { name: 'aaaa', cm: '毛豆炸酱盖浇饭', jg: '8' }
    */
    console.log("name here");
    console.log(req.body.username);
    if (req.body.username === "") {
        console.log("名字是空的");
        res.send({
            response_char: "noname"
        });
        return;
    } else {
        //var new_name_base64 = (new Buffer(req.body.username)).toString('base64');
        //req.body.username = new_name_base64;
    }
    console.log(req.body.orderlist);
    //获得当前时间戳
    var now_date_obj = new Date();
    var now_time = now_date_obj.toLocaleString();
    now_time = dateFormat(now_time, "yyyy-mm-dd HH:MM:ss");
    console.log("now time is ");
    console.log(now_time);
    //绑定属性:ordertime  订餐时间
    req.body.ordertime = now_time;
    console.log(req.body);
    //绑定属性:ispaid   未付款，等待管理员操作
    req.body.ispaid = "未付款";
    //生成订单号:base64(用户名)+time("yyyymmddHHMMss")
    var new_name_base64 = (new Buffer(req.body.username)).toString('base64');
    var order_number = new_name_base64 + dateFormat(now_date_obj, "yyyymmddHHMMss");
    req.body.order_number = order_number;
    //console.log("your order number here");
    //console.log(order_number);

    fs.readFile(path_food_orders, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var food_orders_json = JSON.parse(data);
        food_orders_json.push(req.body);
        console.log("现在的json是：");
        console.log(food_orders_json);

        fs.writeFile(path_food_orders, JSON.stringify(food_orders_json), function(err) {
            console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
            //console.log(food_orders_json.username);
            console.log(food_orders_json);
            //res.send("您的购物车请求已提交，感谢您的惠顾！！");
            res.send({
                response_char: "saveit",
                content: req.body
            });
        });
    });
};

exports.show = function(req, res) {
    //GET     /orderlist/:num    num:用户名map数字
    //res.send('you request your orderlist: ' + req.params.orderlist);//req.params.orderlist:num
    //get param username(num)
    var username_num = req.params.orderlist;
    console.log("get the username is:" + username_num);
    fs.readFile(path_food_orders, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var food_orders_json = JSON.parse(data);
        var new_orders = food_orders_json.filter(function(element) {
            //return something;
            if (username_num == element.username) {
                return element;
            }
        });
        //直接发送json集合
        res.send(new_orders);
        // food_orders_json.forEach(function(element, index, array) {
        //     res.send(element);
        //     console.log("您请求的每一个订单:");
        //     console.log(element);
        // });
    });
};

exports.edit = function(req, res) {
    //GET     /orderlist/:num/edit
    res.send('edit orderlist ' + req.params.orderlist);
};

exports.update = function(req, res) {
    //PUT     /orderlist/:num
    //接收两个参数时: //暂时保留
    // var params = req.params.orderlist.split('&');
    // var username = params[0];
    // var ordertime = params[1];
    // 获得参数：订单号
    var order_number = req.params.orderlist;
    //res.send(username);
    fs.readFile(path_food_orders, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var food_orders_json = JSON.parse(data);
        var new_orders = food_orders_json.filter(function(element) {
            //return something;
            if (order_number == element.order_number) {
                element.ispaid = "已付款";
                return element;
            }
        });
        console.log(food_orders_json);
        fs.writeFile(path_food_orders, JSON.stringify(food_orders_json), function(err) {
            //console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
            //console.log(food_orders_json);
            //res.send("您的购物车请求已提交，感谢您的惠顾！！");
            if (err) throw err;
            res.send("updateOK");
        });
        //直接发送json集合

        // food_orders_json.forEach(function(element, index, array) {
        //     res.send(element);
        //     console.log("您请求的每一个订单:");
        //     console.log(element);
        // });
    });
};

exports.destroy = function(req, res) {
    //DELETE  /orderlist/:num
    res.send('destroy orderlist ' + req.params.orderlist);
};
