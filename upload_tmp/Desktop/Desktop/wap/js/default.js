$(function () {
  // 展开导航
  $('body').on('click', '#nav-button', function (event) {
    event.preventDefault();
    $('#page-nav').toggleClass('active');
  });

  // 跳转留言板
  $('body').on('click', '[data-target="guestbook"]', function (event) {
    event.preventDefault();
    $('#guestbook')[0].scrollIntoView();
    $('#guestbook input#name')[0].focus();
  });

  // 内容展开
  $('.main-section').eq(0).addClass('active');
  $('body').on('click', '.main-section-header', function (event) {
    event.preventDefault();
    $(this).closest('.main-section').toggleClass('active');
  });
  
  (function() {
        var head = document.head;
        head.addEventListener('DOMNodeInserted', function (event) {
          var target = event.target;

          if (target.tagName.toLowerCase() == 'meta' && target.content.indexOf('width') == -1) {
            var elem = document.createElement('meta');
            elem.name = 'viewport';
            elem.content = 'width=device-width, user-scalable=no, initial-scale=1';
            document.head.appendChild(elem);
          }
        }, false);
      })();
});

