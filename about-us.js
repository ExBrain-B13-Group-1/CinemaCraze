$(document).ready(function() {
    var menuIcon = $('.menu-icon');
    var dropDown = $('#drop-down');

    function hideDropDown() {
        dropDown.hide();
    }

    menuIcon.on('click', function() {
        if (dropDown.css('display') === 'none') {
            dropDown.css('display', 'flex');
        } else {
            dropDown.hide();
        }
    });

    $(window).on('resize', function() {
        hideDropDown();
    });
});