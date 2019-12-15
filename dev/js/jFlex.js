/* jflex jquery */

jQuery(document).ready(function ($) {

  /* main-menu collapse animation func */

  jQuery('.menu.expanded ul > li.expanded').not('.menu.expanded ul > li.expanded li, .js__hoverFlow-disabled .menu.expanded ul > li.expanded, .menu.expanded.js__hoverFlow-disabled ul > li.expanded').hover(function(e) {
    jQuery(this).find('ul').hoverFlow(
      e.type,
      {
      'height': 'show',
      'marginTop': 'show',
      'marginBottom': 'show',
      'paddingTop': 'show',
      'paddingBottom': 'show'
      },
      150,
      undefined,
      function () {
        removeOverflow($(this));
      }
      );
  }, function(e) {
    jQuery(this).find('ul').hoverFlow(e.type, {
      'height': 'hide',
      'marginTop': 'hide',
      'marginBottom': 'hide',
      'paddingTop': 'hide',
      'paddingBottom': 'hide' 
      },
      100/*,
      undefined,
      function () {
        removeOverflow($(this));
      }*/);
    });

  function removeOverflow(el) {
    $(el).css({
      overflow: ''
    });
  }

  /* main-menu a name title span */


  jQuery('#main-menu a').each(function () {
    if(jQuery(this).attr('name')) {
      jQuery(this).addClass('named');
      nametitle = jQuery(this).attr('name');
      jQuery('<i>'+ nametitle +'</i>').appendTo(jQuery(this));
    }
  });

  /* footer expanded menu fixing */

  jQuery('footer li.expanded > span, footer li.expanded > a').hover(function () {
      var $footerlinkwidth = jQuery(this).width();
      jQuery(this).parent().find('ul').css({left: $footerlinkwidth + 25 + 'px'});
  });

  /* bg image to css background-image cover */

  jQuery('img.bg').each(function () {
      bgimgsrc = jQuery(this).attr('src');
      jQuery(this).parents('.bg-to').css('background-image', 'url("' + bgimgsrc + '")');
      jQuery(this).remove();
  });

  //var searchBlock = jQuery('#search-block-form');
  //var searchBlock = jQuery('body.ismobiledevice #search-block-form');
  //if (searchBlock.lenght) {
  //  searchBlock.find('input[name="search_block_form"]').blur(function () {
  //    searchBlock.find('.form-item ul.ui-autocomplete').show();
  //  });
  //}
});


/* img scale for retina displays *//*
function changeSizeImgRetina() {
  var $ = jQuery;

  $('img.retina, .photo.retina>img').once().each(function () {
    var imgSize = getImgSize(this);
    var src = this.getAttribute('src');
    var dataSrc = this.getAttribute('data-src');

    if (imgSize.natWidth > 30 && (!dataSrc || dataSrc === src)) {
      resize(this);
    }
    else {
      loadImg(this);
    }
  });

  function resize (img) {
    var $img = $(img);
    if (!$img.hasClass('retina-show')) {
      var imgSize = getImgSize(img);
      var retinawidth = imgSize.natWidth / 2;
      var retinaheight = imgSize.natHeight / 2;

      $img.css({
        'width' : retinawidth,
        'height' : retinaheight
      }).addClass('retina-show');

      $img.trigger('retina:show');
    }
  }

  function getImgSize (img) {
    var $img = $(img);

    return {
      natHeight: $img.naturalHeight(),
      natWidth: $img.naturalWidth()
    };
  }

  function loadImg(img) {
    var $imgSource = $(img);
    var src = $imgSource.attr('data-src') || $imgSource.attr('src');
    var $imgClone = $('<img>');

    $imgClone.on('load', function() {
      $imgClone.remove();
      $imgSource
        .attr('src', src);

      resize($imgSource);
    });

    $imgClone.attr('src', src);
  }
}*/