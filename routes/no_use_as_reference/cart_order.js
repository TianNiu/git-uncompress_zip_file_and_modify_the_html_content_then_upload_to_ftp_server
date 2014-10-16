/*
 * 处理用户订餐请求
 */
//文件模块
var fs = require('fs');

//var path_record_file = "./config/order_record.json";
//result结果文件夹中  food_orders.json:保存用户订单
var path_food_orders = "./result/food_orders.json";

exports.main = function(req, res) {
    //res.send("您请求的是");

    /*req.query look like below, 原本就是json格式
         { name: 'aaaa', cm: '毛豆炸酱盖浇饭', jg: '8' }
    */

    console.log(req.body.username);
    if (req.body.username === "") {
        console.log("名字是空的");
        res.send("请填写姓名");
        return;
    }
    console.log(req.body.orderlist);
    //console.log(req.query.cm);
    //console.log(req.query.jg);
    //console.log("run here");
    //var this_order_record=JSON.parse(req.query);
    //console.log("this is solved by me");
    //console.log(req.query);

    //get now time
    var now_date_obj = new Date();
    var now_time = now_date_obj.toLocaleString();
    console.log("now time is ");
    console.log(now_time);
    //绑定属性:ordertime  订餐时间
    req.body.ordertime = now_time;
    console.log(req.body);

    fs.readFile(path_food_orders, function(err, data) {
        if (err) throw err;
        //得到json(!数组)
        var food_orders_json = JSON.parse(data);
        food_orders_json.push(req.body);
        console.log("现在的json是：");
        console.log(food_orders_json);

        fs.writeFile(path_food_orders, JSON.stringify(food_orders_json), function(err) {
            console.log("收到了一个新的订餐请求，现在的订餐列表如下：");
            console.log(food_orders_json);
            res.send("您的购物车请求已提交，感谢您的惠顾！！");
        });

        //JSON.stringify



    });

    //向客户端返回成功响应

    /*
    fs.readFile('./config/menu.json', function(err, data) {
         if (err) throw err;

         var menu_json_obj = JSON.parse(data);
         console.log(menu_json_obj);


         res.render('handle_order.html', {
              tip: "您点餐了",
              menu_json: menu_json_obj
         });

    });
    */

};
