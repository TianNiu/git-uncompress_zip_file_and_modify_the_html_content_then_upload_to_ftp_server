var express = require('express');
var app = express();
var path = require('path');
var index = require('./routes/index.js');
var uploadhandler = require('./routes/uploadhandler.js');
var formidable = require('formidable');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
/* routes*/
/*app.get("/", index.main);
app.get("/index", index.main);
app.get('/', function(req, res) {
    res.send('hello world');
});
app.post("/uploadfile", uploadhandler.main);*/

/**
 * resourceful 路由方式
 */
require('./router').main(app);

app.listen(3000);
