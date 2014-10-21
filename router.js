/**
 * 传统路由方式
 */
/**
 * require package
 * @type {[type]}
 */
// var routes = require('./routes'),
//     user = require('./routes/user'),
//     handle_order = require('./routes/handle_order'),
//     cart_order = require('./routes/cart_order'),
//     menulist = require('./routes/menulist'),
//     admin = require('./routes/admin');
/**
 * GET Router
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
// exports.get = function(app) {
//     app.get('/', routes.index);
//     app.get('/index', routes.index);
//     app.get('/users', user.list);
//     app.get('/admin', admin.main);
//     app.get('/handle_order', handle_order.main);
//     app.get('/menulist', menulist.getMenuList);

//     //以上条件不匹配时，转到下面的错误处理
//     //app.get('*', error.notfound);
// };
/**
 * POST Router
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
// exports.post = function(app) {
//     app.post('/cart_order', cart_order.main);

// };

var index = require('./routes/index.js');
var uploadhandler = require('./routes/uploadhandler.js');
var DoUpload = require('./routes/DoUpload');
//var project_image_display = require('./routes/common_routes/project_image_display.js');
/**
 * resourceful 路由方式
 */
exports.main = function(app) {
    /**
     * 用户主页(index)路由
     */
    app.get("/", index.main);
    app.get("/index", index.main);
    app.get("/index.html", index.main);
    app.post("/uploadfile", uploadhandler.main);
    /* for 练习*/
    app.get("/i-want-upload", DoUpload.main);
    //menulist使用资源式路由
    //
    //app.resource('menulist', require('./routes/menulist.js'));

    // app.resource('menulists', function() {
    //     this.collection.get('search');
    //     this.member.get('reply');
    // });
    // menulist资源式路由
    //
    //app.resource('menulist');
    //app.get("/project_image_display", project_image_display.main);

    /**
     * admin route  管理员路由
     */
    //app.get("/admin", admin.main);


    //orderlist资源式路由
    //app.resource('orderlist');
    //
    //orderlist资源式路由 暂时不用
    //app.resource('resource_project_image_display');


};
