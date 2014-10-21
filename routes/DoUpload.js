/************************************************
 * Module
 * 根据获得的路径数组上传文件
 * @type {[type]}
 ************************************************/
var JSFtp = require("jsftp");
/**
 * 远程服务器配置
 * @type {JSFtp}
 */
var Ftp = new JSFtp({
    host: "58.68.237.182",
    user: "sKrl6B", // defaults to "anonymous"
    pass: "lZx3Go16hG0ps9Li" // defaults to "@anonymous"
});
/**
 * 本地服务器配置
 * @type {JSFtp}
 */
Ftp = new JSFtp({
    host: "127.0.0.1",
    user: "111", // defaults to "anonymous"
    pass: "", // defaults to "@anonymous"
    port: 16161
});

exports.main = function(req, res) {
    var counter = 1;
    /**
     * 连接远程FTP服务器，测试
     * @return {[type]} [description]
     */
    /*function iterator() {
        Ftp.put('public/img/' + i + '.png', '/lianzhan_site/web/000000test/' + i + '.png', function(hadError) {
            console.log('done');
            if (i < 3) {
                i++;
                iterator();
            }
        });
    }*/
    /**
     * 连接本地服务器
     * @return {[type]} [description]
     */
    function uploadOneByOne() {
        //console.log(counter);
        //console.log("ftp_url ftp_url ftp_url ftp_url:" + params.ftp_url);
        //url_temp = local_url_ls[counter].replace(/upload_tmp/, params.ftp_url);
        var Ftp = new JSFtp({
            host: "127.0.0.1",
            user: "111", // defaults to "anonymous"
            pass: "", // defaults to "@anonymous"
            port: 16161
        });
        //console.log("url_temp url_temp:" + url_temp);
        Ftp.put('public/img/' + counter + '.png', '/www1/' + counter + '.png', function(err) {
            if (!err) {
                console.log("File transferred successfully!");
                //counter++;
                if (++counter < 5) {
                    //setTimeout(uploadOneByOne, 300);
                    //after one been sent, quit then connect again
                    Ftp.raw.quit(function(err, data) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("Bye!");
                        uploadOneByOne();
                    });


                } else {
                    /* counter 达到file总数，即发送完毕时，终止连接*/
                    Ftp.raw.quit(function(err, data) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("Bye and the message from server is:" + data);
                        //uploadOneByOne();
                    });
                }


            } else {

            }

        });
    }
    uploadOneByOne();
    res.send("hello you send");
};
