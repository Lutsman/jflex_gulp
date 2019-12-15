/* jflex modules jquery */

jQuery(document).ready(function ($) {

    /* phone mask in input field */
    $('input[name="submitted"], input[name="phone"], .field-delivery_phone input[type="text"]').mask("+7 (999) 999 99 99?9", {placeholder: " "});


    /* slide up page button arrow */
    $(window).scroll(function () {
        if ($(window).scrollTop() < 300) {
            $('#page-slideup').fadeOut();
        }

        if ($(window).scrollTop() > 300) {
            $('#page-slideup').fadeIn();
        }
    });
    $('#page-slideup').click(function () {
        $('html,body').animate({scrollTop: 0}, 'slow');
        return false;
    });

    /* breadcrumb menu collapse animation func */

    $('.breadcrumb .expanded').hover(function (e) {
        $(this).find('ul').hoverFlow(e.type, {
            'height': 'show',
            'marginTop': 'show',
            'marginBottom': 'show',
            'paddingTop': 'show',
            'paddingBottom': 'show'
        }, 150);
    }, function (e) {
        $(this).find('ul').hoverFlow(e.type, {
            'height': 'hide',
            'marginTop': 'hide',
            'marginBottom': 'hide',
            'paddingTop': 'hide',
            'paddingBottom': 'hide'
        }, 100);
    });

    /* slideshow controls fadein/out display */

    $('.page-slideshow.hidecontrols').hover(function () {
        $(this).find('.pn-control').fadeIn('100');
    }, function () {
        $(this).find('.pn-control').fadeOut('50');
    });

    /* remove links from complete message on webform */


    if ($('.webform-confirmation').length) {
        $('.links').remove();
        setTimeout(function () {
            parent.history.back();
        }, 10000);
        return false;
    }


    // set checked in newsletter and terms agreement checkboxes in checkout

    $('#checkout .pane.simplenews .form-checkbox, #checkout .pane.terms .form-checkbox').attr('checked', 'checked');


    // forms and messages animation appearance

    $('#user-login, #user-register-form, #user-pass, .messages').fadeIn(800);


});
