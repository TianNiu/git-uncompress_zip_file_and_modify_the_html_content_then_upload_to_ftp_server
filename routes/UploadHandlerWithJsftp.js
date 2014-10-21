/************************************************
 * 根据获得的路径数组上传文件
 * @type {[type]}
 ************************************************/
var JSFtp = require("jsftp");

/**
 * 使用jsftp模块重新连接服务器，使用获得的路径数组上传文件
 * @return {[type]} [description]
 */
function createNewConn(params) {
    return new JSFtp({
        host: params.ftp_servers,
        user: params.ftp_username,
        pass: params.ftp_password,
        port: 16161
    });

}
module.exports = function(params, local_url_ls) {
    //console.log(local_url_ls);
    /* 再次连接ftp服务器*/

    var url_temp = "";
    for (var roo = 0; roo < local_url_ls.length; roo++) {

    }
    var file_num = local_url_ls.length;
    var counter = 0;

    function uploadOneByOne() {
        console.log(counter);
        console.log("ftp_url ftp_url ftp_url ftp_url:" + params.ftp_url);
        url_temp = local_url_ls[counter].replace(/upload_tmp/, params.ftp_url);
        var Ftp = createNewConn(params);
        //console.log("url_temp url_temp:" + url_temp);
        Ftp.put(local_url_ls[counter], url_temp, function() {

            console.log("File transferred successfully!");
            //counter++;
            if (++counter < file_num) {
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




        });
    }
    uploadOneByOne();

    console.log("you know me?");
    console.log("i am huazai");
};
