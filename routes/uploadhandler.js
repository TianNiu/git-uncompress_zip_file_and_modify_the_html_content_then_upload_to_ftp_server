/*
 * GET home page.
 */
//文件模块
var fs = require('fs');
var util = require('util');
var unzip = require('unzip');
var formidable = require('formidable');
var cheerio = require('cheerio');
var ftp = require('ftp');
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
var ftp_client = new ftp();
/**
 * 遍历文件夹函数 深度优先
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function walk(file_ls, path, remote_path) {
        console.log("so the walk path is:" + path);
        var dirList = fs.readdirSync(path).toString().split(",");
        //console.log("now dir info is:" + dirList.join("-"));
        var items_length = dirList.length;
        console.log("items_length is:" + items_length);
        //dirList = dirList.slice(0, 10);

        var order = 0;

        function makeItemByOrder(dirList) {
            console.log("now all in the folder is:" + dirList);
            console.log("now folder name is:" + dirList[order]);
            //items_length = dirList.length;
            if (order < items_length) {
                if (fs.statSync(path + '/' + dirList[order]).isDirectory()) {
                    console.log(dirList[order] + "is dir!!!!!!");
                    walk(file_ls, path + '/' + dirList[order], remote_path + '/' + dirList[order]);
                    /*ftp_client.mkdir(remote_path+dirList[order],function(err){
                        if(err){
                            throw err;
                        }else{
                            console.log("create dir good");
                        }
                    });*/
                    /*ftp_client.pwd(function(err,cwd){
                        console.log("now cwd is:"+cwd);
                    });
                    //console.log("you do it");
                    ftp_client.mkdir("soodoo", function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("create dir good");
                        }
                    });*/
                    /*ftp_client.mkdir(dirList[order], function(err) {
                        if (err) {
                            throw err;
                        } else {

                            //order = order + 1;
                            console.log("innner dirList[order] is:"+dirList[order]);
                            walk(file_ls, path + '/' + dirList[order], remote_path + '/' + dirList[order]);
                            //makeItemByOrder(dirList[order]);

                            //order = order++;
                            console.log("now the order is"+order);
                            makeItemByOrder(dirList[++order]);
                        }

                    });*/
                } else {
                    file_ls.push(path + '/' + dirList[order]);
                    //ftp_client.put(path + '/' + dirList[order], remote_path + '/' + dirList[order]);
                    //ftp_client.put(path + '/' + dirList[order], remote_path + '/' + dirList[order]);

                    console.log("innner dirList[order] is:" + dirList[order]);
                    console.log("now the order is" + order);


                }
                order = order + 1;
                console.log("you do not understand me:" + order);
                makeItemByOrder(dirList);

            } else {

            }

        }
        makeItemByOrder(dirList);

        /*arr = [1,2,3,4,5];
        arr.forEach(function(item) {
            setTimeout(function() {
                alert(item);
            }, 5000)
        });*/


        // dirList.forEach(function(item) {
        //     console.log("i am the item :" + item);
        //     if (fs.statSync(path + '/' + item).isDirectory()) {
        //         console.log("the item is dir");
        //         console.log("remote dir is:");
        //         console.log(remote_path + '/' + item);
        //         /*ftp_client.mkdir(item,function(err){
        //             if(err){
        //                 throw err;
        //             }else{
        //                 ftp_client.cwd(item);
        //             }
        //         });*/

        //         ftp_client.mkdir(item, function(err) {
        //             if (err) {
        //                 throw err;
        //             } else {

        //             }
        //         });
        //         //walk(file_ls,path + '/' + item,remote_path+'/'+item);
        //         //setTimeout(walk(file_ls,path + '/' + item,remote_path+'/'+item), 1000);
        //         //walk(file_ls,path + '/' + item,remote_path+'/'+item);
        //         /*ftp_client.mkdir(item,function(err){
        //             if(err){
        //                 throw err;
        //             }else{
        //                 ftp_client.cwd(item,function(err,currentDir){
        //                     walk(file_ls,path + '/' + item,remote_path+'/'+item);            
        //                 });
        //             }
        //         });*/

        //     } else {
        //         console.log("the item is file");
        //         file_ls.push(path + '/' + item);
        //         //ftp_client.put(path + '/' + item, remote_path + '/' + item);
        //         ftp_client.put(path + '/' + item, remote_path + '/' + item);
        //         //ftp_client.put(path + '/' + item, remote_path);
        //     }
        // });
    }
    /**
     * 修改文件内容并重新写入
     * @param  {[type]} index_path               [description]
     * @param  {[type]} the_index_path_in_folder [description]
     * @return {[type]}                          [description]
     */
function modifyIndexFile(index_path, the_index_path_in_folder, afterModified) {
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
                            afterModified();
                        }
                    });
                    console.log("文件路径是:" + index_path);
                    console.log("真实路径是:" + the_index_path_in_folder);
                }
            });
        }
    });

}

function walkUploadFile(local_file_root, remote_file_root) {
    var file_ls = [];
    remote_file_root = ".";
    walk(file_ls, local_file_root, remote_file_root);
    console.log(file_ls);
}

function upToTheRootDir(path, _stop, callback) {
    if (!_stop) {
        console.log("path in the loop is:" + path);
        if (path !== '/') {
            ftp_client.cdup(function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log("change the dit up");
                    ftp_client.pwd(function(err, cwd) {
                        if (err) {
                            throw err;
                        } else {
                            upToTheRootDir(cwd, false, callback);
                            console.log("it is not the root dir, now the dir is:" + path);
                        }
                    });

                }
            });

        } else {
            upToTheRootDir(path, true, callback);
            console.log("it is the root dir" + path);
        }
    } else {
        callback();
    }
}

exports.ftphandler = function(params) {
        var the_zip_filename = params.filename;
        var uncompress_foldername = the_zip_filename.slice(0, -4);
        var remote_url = params.ftp_servers + "/" + params.ftp_url;
        //console.log(the_zip_filename.slice(0, -4));
        //the_zip_filename.slice(0, -3);
        console.log(params);
        var _once = true;
        ftp_client.on('ready', function() {
            if (_once) {
                ftp_client.pwd(function(err, cwd) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("soga the initial dir is:" + cwd);
                        //upto the user's root dir
                        upToTheRootDir(cwd, false, function() {
                            ftp_client.cwd(params.ftp_url, function(err, currentDir) {
                                if (err) throw err;
                                console.log("now the dir is:" + currentDir);
                                //ftp_client.put();
                                ftp_client.mkdir(uncompress_foldername, function(err) {
                                    if (err) {
                                        throw err;
                                    }
                                    ftp_client.cwd(uncompress_foldername, function(err, currentDir) {
                                        if (err) {
                                            throw err;
                                        }

                                        //console.log("compressed file name is:" + uncompress_foldername);
                                        //console.log("after change the dit, now the dir is:" + currentDir);
                                        var local_file_root = "./upload_tmp/" + uncompress_foldername;
                                        console.log("local_file_root is:" + local_file_root);
                                        walkUploadFile(local_file_root, uncompress_foldername);
                                        /* log out the ftp server*/
                                        ftp_client.logout(function() {
                                            console.log("hah");
                                        });
                                    });
                                    _once = false;
                                });
                                //walkUploadFile(uncompress_foldername, remote_url);
                            });
                        });
                        //ftp_client.cwd();
                    }
                });
            }



        });
        ftp_client.connect({
            host: params.ftp_servers,
            user: params.ftp_username,
            password: params.ftp_password,
        });
    }
    /**
     * 接收表单信息，压缩文件并修改
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
exports.main = function(req, res) {
    //var now_time = dateFormat((new Date), "yyyymmddHHMMss");
    //var project_name = req.body("name");
    //var project_link = req.param.link;
    //var project_file = req.files.file;
    /*var ftp_username = req.body("ftp_username");
    var ftp_password = req.body("ftp_password");
    var project_name = req.body("ftp_username");
    this.ftphandler({
        ftp_username:ftp_username,
        ftp_password:ftp_password,
        project_name:project_name
    });*/
    //console.log(project_name);
    //console.log(project_link);
    var form = new formidable.IncomingForm();
    //提取到的index文件的外层路径
    var the_index_path = "";
    //在解压后的文件夹中的index的路径
    var the_index_path_in_folder = "";
    var form_fields = {};

    form.uploadDir = "./upload_tmp";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        //console.log(fields);
        //console.log(files.file);
        /* */
        form_fields = fields;
        form_fields.filename = files.file.name;
        /* util.inspect 转化成字符串工具*/
        res.render("result-of-upload.ejs", {
            file_info: util.inspect({
                fields: fields,
                files: files
            })
        });
        /*res.render("result-of-upload.ejs", {
            file_info: JSON.stringify(fields)
        });*/
        /*res.render("uploadover.html",{
            fields: fields,
            files: files
        });*/
        //console.log("");
        /*res.end(util.inspect({
            fields: fields,
            files: files
        }));*/
    });

    form.on('file', function(name, file) {
        //console.log("file name is:");
        //console.log(name);
        //console.log("file is:");
        //console.log(file.name);
        if (file.name == "" || file.size <= 0) {
            return;
        }
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
                        //递归输出之后从zip中得到单个index.html文件
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
                                        modifyIndexFile(the_index_path, the_index_path_in_folder, function() {
                                            //修改完毕之后处理ftp上传事务
                                            console.log("write end sooooooooooooooooooo");
                                            exports.ftphandler(form_fields);
                                        });
                                        //console.log("write end sooooooooooooooooooo");
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
