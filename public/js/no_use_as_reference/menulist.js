/**
 *
 * @return {[type]} [description]
 */
    $(function() {
        //切换加号按钮的可见性
        $(".sidebar").on('mouseenter', 'li', function(event) {
            /* Act on the event */
            var self = $(this);
            self.find("img").css("visibility", "visible");
            //alert("ok");
        });
        $(".sidebar").on('mouseleave', 'li', function(event) {
            /* Act on the event */
            var self = $(this);
            self.find("img").css("visibility", "hidden");
            //alert("ok");
        });

    });

