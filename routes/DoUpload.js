var JSFtp = require("jsftp");

var Ftp = new JSFtp({
    host: "58.68.237.182",
    user: "sKrl6B", // defaults to "anonymous"
    pass: "lZx3Go16hG0ps9Li" // defaults to "@anonymous"
});


exports.main = function(req, res) {
    var i = 1;

    function iterator() {
        Ftp.put('public/img/' + i + '.png', '/lianzhan_site/web/000000test/' + i + '.png', function(hadError) {
            console.log('done');
            if (i < 3) {
                i++;
                iterator();
            }
        });
    }

    iterator();
    res.send("hello you send");
};
