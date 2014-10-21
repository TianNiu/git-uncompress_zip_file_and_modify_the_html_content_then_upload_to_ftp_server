/************************************************
 * 处理上传压缩文件请求
 ************************************************/
//文件模块
var fs = require('fs');
var util = require('util');
var unzip = require('unzip');
var formidable = require('formidable');
var cheerio = require('cheerio');
var ftp = require('ftp');
var JSFtp = require("jsftp");

var UploadHandlerWithJsftp = require("./UploadHandlerWithJsftp");
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

                ftp_client.mkdir(remote_path + '/' + dirList[order], function(err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("create dir good");
                    }
                });
                walk(file_ls, path + '/' + dirList[order], remote_path + '/' + dirList[order]);
            } else {
                file_ls.push(path + '/' + dirList[order]);
                //console.log("innner dirList[order] is:" + dirList[order]);
                //console.log("now the order is" + order);
            }
            order = order + 1;
            console.log("you do not understand me:" + order);
            makeItemByOrder(dirList);

        } else {

        }

    }
    makeItemByOrder(dirList);

};
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
            //console.log($("head title").text());
            //console.log(index_path);
            $("body").append(file_addtion.toString());
            var str = fs.realpathSync('.');
            //console.log("这个文件存在吗");
            //console.log(fs.existsSync("upload_tmp/wap/wap/index.html"));
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

};
/**
 * 遍历本地目录，在remote目录上建立文件夹
 * @param  {[type]} local_file_root  [description]
 * @param  {[type]} remote_file_root [description]
 * @return {[type]}                  [description]
 */
function walkUploadFile(local_file_root, remote_file_root) {
    var file_ls = [];
    remote_file_root = ".";
    walk(file_ls, local_file_root, remote_file_root);
    //console.log(file_ls);
    return file_ls;
};
/**
 * upToTheRootDir
 * @param  {[type]}   path     [description]
 * @param  {[type]}   _stop    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
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
};
/**
 * ftphandler
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
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
                                    UploadHandlerWithJsftp(params, walkUploadFile(local_file_root, uncompress_foldername));
                                    /* log out the ftp server*/
                                    /*ftp_client.logout(function() {
                                        console.log("hah");
                                    });*/
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
        port: 16161
    });
};
/**
 * 接收表单信息，压缩文件并修改
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.main = function(req, res) {
    /* 使用formidable处理表单数据，包含文件*/
    var form = new formidable.IncomingForm();
    //提取到的index文件的外层路径
    var the_index_path = "";
    //在解压后的文件夹中的index的路径
    var the_index_path_in_folder = "";
    var form_fields = {};

    form.uploadDir = "./upload_tmp";
    form.keepExtensions = true;
    /**
     * 从表单解析出字段和文件信息
     * @param  {[type]} err    [description]
     * @param  {[type]} fields [description]
     * @param  {[type]} files  [description]
     * @return {[type]}        [description]
     */
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
    });
    /**
     * 当获得文件触发
     * @param  {[type]} name [description]
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    form.on('file', function(name, file) {
        if (file.name == "" || file.size <= 0) {
            return;
        }
        var old_path = file.path;
        var new_path = "upload_tmp/" + file.name;
        var new_path_dirpart = new_path.slice(0, -4);
        var fileList = [];
        /* formidable 表单模块会将文件随机命名，所以需要使用rename将其命名为原来的压缩文件名*/
        fs.rename(old_path, new_path, function(err) {
            if (err) {
                throw err;
            }
            //console.log("rename success");
            /* 如果是.zip的压缩的文件*/
            if (/.zip/.test(new_path)) {

                /* 不存在目录则首先创建解压目录*/
                if (!fs.existsSync(new_path)) {
                    fs.mkdirSync(new_path);
                }
                /**
                 * 1.读取(压缩)文件流
                 * 2.pipe到upzip模块的方法Extract()递归解压到目录:new_path_dirpart
                 * 3.以上步骤完毕之后(映射解压完毕)，再次读取压缩文件，用于从中寻找index.html
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
                                /* 如果是index.html文件*/
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
                                } else {
                                    entry.autodrain();
                                }
                            });
                    });
            }

        });

    });
    
};
