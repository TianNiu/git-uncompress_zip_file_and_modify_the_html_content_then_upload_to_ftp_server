/*
 * GET home page.
 */
//文件模块
var fs = require('fs');
//时间格式模块
var dateFormat = require('dateformat');
// exports.index = function(req, res) {
//     //res.render('index', { title: 'Express' });
//     //res.send("您请求的是");

//     fs.readFile('./config/menu.json', function(err, data) {
//         if (err) throw err;

//         var menu_json_obj = JSON.parse(data);
//         console.log(menu_json_obj);
//         res.render('index.html', {
//             tip: "您点餐了",
//             menu_json: menu_json_obj
//         });
//     });
// };

exports.main = function(req, res) {
    // var now_time = dateFormat((new Date), "yyyymmddHHMMss");
    // res.render('index.html', {
    //     now_time: now_time
    // });

    res.render('default.html');
};
/*
exports.main = function(req, res) {
     //res.send("您请求的是");

     fs.readFile('./config/menu.json', function(err, data) {
          if (err) throw err;

          var menu_json_obj = JSON.parse(data);
          console.log(menu_json_obj);
          res.render('handle_order.html', {
               tip: "您点餐了",
               menu_json: menu_json_obj
          });
     });

};
*/
