/*
 * GET home page.
 */
//文件模块
var fs = require('fs');
var util = require('util');
var unzip = require('unzip');
var formidable = require('formidable');
var cheerio = require('cheerio');
//时间格式模块
//var dateFormat = require('dateformat');
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
/**
 * 遍历文件夹函数
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function walk(path) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            walk(path + '/' + item);
        } else {
            file_ls.push(path + '/' + item);
        }
    });
}

function modifyIndexFile(index_path, the_index_path_in_folder) {
    fs.readFile(index_path, "utf-8", function(err, data) {
        if (err) {
            throw err;
        } else {
            //console.log(data.toString());
            /*var $addition = cheerio.load(data.toString(), {
                decodeEntities: false
            });*/
            var $ = cheerio.load(data.toString(), {
                decodeEntities: false
            });
            //$("nav a").text("soga");
            //console.log();
            //带插入的底部脚本文件
            var file_addtion = fs.readFileSync("./config/addtion_1.html", "utf-8");
            //console.log("附加文件:"+file_addtion);
            $("head title").text($("nav#breadcrumbs a").text());
            console.log($("head title").text());
            console.log(index_path);
            $("body").append(file_addtion.toString());
            //console.log("输出脚本"+$("script").last().html());
            //console.log($.html());

            //console.log($addition.html());
            //$.html();
            var str = fs.realpathSync('.');
            console.log("这个文件存在吗");
            console.log(fs.existsSync("upload_tmp/wap/wap/index.html"));
            fs.writeFile(index_path, $.html(), "utf-8", function(err) {
                if (err) {
                    throw err;
                } else {
                    fs.rename(index_path, the_index_path_in_folder, function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("move over");
                        }
                    });
                    console.log("文件路径是:" + index_path);
                    console.log("真实路径是:" + the_index_path_in_folder);
                }
            });
        }
    });

}
exports.main = function(req, res) {
    //var now_time = dateFormat((new Date), "yyyymmddHHMMss");
    //var project_name = req.body("name");
    //var project_link = req.param.link;
    //var project_file = req.files.file;

    //console.log(project_name);
    //console.log(project_link);
    var form = new formidable.IncomingForm();
    //提取到的index文件的外层路径
    var the_index_path = "";
    //在解压后的文件夹中的index的路径
    var the_index_path_in_folder = "";

    form.uploadDir = "./upload_tmp";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        //console.log(fields);
        //console.log(files.file);
        /* util.inspect 转化成字符串工具*/
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });

    form.on('file', function(name, file) {
        //console.log("file name is:");
        //console.log(name);
        //console.log("file is:");
        //console.log(file.name);
        var old_path = file.path;
        var new_path = "upload_tmp/" + file.name;
        var new_path_dirpart = new_path.slice(0, -4);
        var fileList = [];
        fs.rename(old_path, new_path, function(err) {
            if (err) {
                throw err;
            }
            //console.log("rename success");
            if (/.zip/.test(new_path)) {

                //console.log("right");
                if (!fs.existsSync(new_path)) {
                    /* 首先创建解压目录*/
                    fs.mkdirSync(new_path);
                }
                /**
                 * 步骤1：如果是zip文件，解压到upload_tmp文件夹下
                 */
                fs.createReadStream(new_path)
                    .pipe(unzip.Extract({
                        path: new_path_dirpart
                    }))
                    .on("close", function() {
                        //console.log("haha  you just finish");
                        fs.createReadStream(new_path)
                            .pipe(unzip.Parse())
                            .on('entry', function(entry) {
                                var fileName = entry.path;
                                var type = entry.type; // 'Directory' or 'File'
                                var size = entry.size;

                                if (/index.htm/.test(fileName)) {
                                    //console.log("hah"+new_path);
                                    var zipfilename_with_path = new_path.slice(0, new_path.indexOf(".zip"));
                                    console.log("zip path" + zipfilename_with_path);
                                    console.log("my name is:" + fileName);
                                    //在解压之后的文件夹下的index文件的真实路径
                                    the_index_path_in_folder = "./" + zipfilename_with_path + "/" + fileName;
                                    //the_index_path_in_folder = zipfilename_with_path + "/" + fileName;
                                    console.log("the index file path in folder is:" + the_index_path_in_folder);
                                    //console.log(entry);
                                    var filename_dir = fileName.slice(0, (fileName.indexOf("index") - 1));
                                    console.log("filename_dir:" + filename_dir);
                                    console.log("the result path:" + zipfilename_with_path + "/" + filename_dir);
                                    if (!fs.existsSync(zipfilename_with_path)) {
                                        /* 首先创建解压目录*/
                                        fs.mkdirSync(zipfilename_with_path);
                                    }
                                    var file_arr = fileName.split("/");
                                    var file_it = file_arr[file_arr.length - 1];
                                    //提取到的index.html的当前路径
                                    the_index_path = "./upload_tmp/" + file_it;

                                    //entry.pipe(fs.createWriteStream(zipfilename_with_path +"/"+ file_it));
                                    var streamWriteIndex = fs.createWriteStream(the_index_path);
                                    /*entry.on("end", function() {
                                        modifyIndexFile(the_index_path, the_index_path_in_folder);
                                    });*/
                                    var r = entry.pipe(streamWriteIndex);
                                    console.log("run here");
                                    r.on("close", function() {
                                        modifyIndexFile(the_index_path, the_index_path_in_folder);
                                        console.log("write end sooooooooooooooooooo");
                                    });
                                    // console.log(entry);
                                    // fs.writeFile(the_index_path, entry, "utf-8", function(err) {
                                    //     if (err) {
                                    //         throw err;
                                    //     }
                                    //     modifyIndexFile(the_index_path, the_index_path_in_folder);
                                    // });

                                    //修改index文件

                                } else {
                                    entry.autodrain();
                                }
                            });
                    });

                //setTimeout(console.log(fs.readdirSync(new_path_dirpart)), 5000);
                //if(fs.readdirSync(new_path_dirpart))
                //var timer_run_walk=setTimeout(function, milliseconds);
                //walk(new_path_dirpart);
                //console.log(fileList);
            }

        });

        /*var contents_in_dir = false;

        function walk(new_path_dirpart) {
            fs.readdir(new_path_dirpart, function(err, files) {
                if (err) {

                }
                if (files) {
                    clearInterval(timer_stop);
                    contents_in_dir = true;
                    console.log("dirs have files");
                }
            });
        }
        var timer_stop = setInterval(walk(new_path_dirpart), 100);*/

        //setTimeout(console.log(fs.readdirSync(new_path_dirpart)), 5000);
    });
    //console.log(req.body);
    //console.log(req.files);
    /*res.render('uploadover.html', {
        project_name: project_name,
        project_link: project_link
    });*/
    //res.send("good");
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
