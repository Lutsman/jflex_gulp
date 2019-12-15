/* Polyfills */
/* closest for IE8+ */

(function () {
  'use strict';

  if(!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var elem = this;

      do {
        if (elem.matches(selector)) {
          return elem;
        }

        elem = elem.parentElement;
      } while (elem);

      return null;
    };
  }
})();

/* matches for IE8+ */
(function () {
  'use strict';

  if (!Element.prototype.matches) {
    Element.prototype.matches = function (selector) {
      var elemColl = this.parentNode.querySelectorAll(selector);

      for(var i = 0; i < elemColl.length; i++) {
        if (elemColl[i] === this) return true;
      }

      return false;
    }
  }
})();

/*classList for IE9+ */
(function(){
  /*
   * Minimal classList shim for IE 9
   * By Devon Govett
   * MIT LICENSE
   */


  if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function() {
        var self = this;
        function update(fn) {
          return function(value) {
            var classes = self.className.split(/\s+/),
              index = classes.indexOf(value);

            fn(classes, index, value);
            self.className = classes.join(" ");
          }
        }

        var ret = {
          add: update(function(classes, index, value) {
            ~index || classes.push(value);
          }),

          remove: update(function(classes, index) {
            ~index && classes.splice(index, 1);
          }),

          toggle: update(function(classes, index, value) {
            ~index ? classes.splice(index, 1) : classes.push(value);
          }),

          contains: function(value) {
            return !!~self.className.split(/\s+/).indexOf(value);
          },

          item: function(i) {
            return self.className.split(/\s+/)[i] || null;
          }
        };

        Object.defineProperty(ret, 'length', {
          get: function() {
            return self.className.split(/\s+/).length;
          }
        });

        return ret;
      }
    });
  }
})();

/*Custom events IE9+*/
(function(){
  try {
    new CustomEvent("IE has CustomEvent, but doesn't support constructor");
  } catch (e) {

    window.CustomEvent = function(event, params) {
      var evt;
      params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
      evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = Object.create(window.Event.prototype);
  }
})();

/*handlebar helpers*/
(function() {
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });


// for detailed comments and demo, see my SO answer here http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional/21915381#21915381

  /* a helper to execute an IF statement with any expression
   USAGE:
   -- Yes you NEED to properly escape the string literals, or just alternate single and double quotes
   -- to access any global function or property you should use window.functionName() instead of just functionName()
   -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } ), notice age is a string, just for so I can demo parseInt later
   <p>
   {{#xif " name == 'Sam' && age === '12' " }}
   BOOM
   {{else}}
   BAMM
   {{/xif}}
   </p>
   */

  Handlebars.registerHelper("xif", function (expression, options) {
    return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
  });

  /* a helper to execute javascript expressions
   USAGE:
   -- Yes you NEED to properly escape the string literals or just alternate single and double quotes
   -- to access any global function or property you should use window.functionName() instead of just functionName(), notice how I had to use window.parseInt() instead of parseInt()
   -- this example assumes you passed this context to your handlebars template( {name: 'Sam', age: '20' } )
   <p>Url: {{x " \"hi\" + name + \", \" + window.location.href + \" <---- this is your href,\" + " your Age is:" + window.parseInt(this.age, 10) "}}</p>
   OUTPUT:
   <p>Url: hi Sam, http://example.com <---- this is your href, your Age is: 20</p>
   */
  Handlebars.registerHelper("x", function (expression, options) {
    var result;

    // you can change the context, or merge it with options.data, options.hash
    var context = this;

    // yup, i use 'with' here to expose the context's properties as block variables
    // you don't need to do {{x 'this.age + 2'}}
    // but you can also do {{x 'age + 2'}}
    // HOWEVER including an UNINITIALIZED var in a expression will return undefined as the result.
    /*with (context) { //with moved out

    }*/
    result = (function () {
      try {
        return eval(expression);
      } catch (e) {
        console.warn('•Expression: {{x \'' + expression + '\'}}\n•JS-Error: ', e, '\n•Context: ', context);
      }
    }).call(context); // to make eval's lexical this=context

    return result;
  });

  /*
   if you want access upper level scope, this one is slightly different
   the expression is the JOIN of all arguments
   usage: say context data looks like this:

   // data
   {name: 'Sam', age: '20', address: { city: 'yomomaz' } }

   // in template
   // notice how the expression wrap all the string with quotes, and even the variables
   // as they will become strings by the time they hit the helper
   // play with it, you will immediately see the errored expressions and figure it out

   {{#with address}}
   {{z '"hi " + "' ../this.name '" + " you live with " + "' city '"' }}
   {{/with}}
   */
  Handlebars.registerHelper("z", function () {
    var options = arguments[arguments.length - 1]
    delete arguments[arguments.length - 1];
    return Handlebars.helpers["x"].apply(this, [Array.prototype.slice.call(arguments, 0).join(''), options]);
  });

  Handlebars.registerHelper("zif", function () {
    var options = arguments[arguments.length - 1]
    delete arguments[arguments.length - 1];
    return Handlebars.helpers["x"].apply(this, [Array.prototype.slice.call(arguments, 0).join(''), options]) ? options.fn(this) : options.inverse(this);
  });


  /*
   More goodies since you're reading this gist.
   */

// say you have some utility object with helpful functions which you want to use inside of your handlebars templates

  util = {

    // a helper to safely access object properties, think ot as a lite xpath accessor
    // usage:
    // var greeting = util.prop( { a: { b: { c: { d: 'hi'} } } }, 'a.b.c.d');
    // greeting -> 'hi'

    // [IMPORTANT] THIS .prop function is REQUIRED if you want to use the handlebars helpers below,
    // if you decide to move it somewhere else, update the helpers below accordingly
    prop: function () {
      if (typeof props == 'string') {
        props = props.split('.');
      }
      if (!props || !props.length) {
        return obj;
      }
      if (!obj || !Object.prototype.hasOwnProperty.call(obj, props[0])) {
        return null;
      } else {
        var newObj = obj[props[0]];
        props.shift();
        return util.prop(newObj, props);
      }
    },

    // some more helpers .. just examples, none is required
    isNumber: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    daysInMonth: function (m, y) {
      y = y || (new Date).getFullYear();
      return /8|3|5|10/.test(m) ? 30 : m == 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31;
    },
    uppercaseFirstLetter: function (str) {
      str || (str = '');
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    hasNumber: function (n) {
      return !isNaN(parseFloat(n));
    },
    truncate: function (str, len) {
      if (typeof str != 'string') return str;
      len = util.isNumber(len) ? len : 20;
      return str.length <= len ? str : str.substr(0, len - 3) + '...';
    }
  };

// a helper to execute any util functions and get its return
// usage: {{u 'truncate' this.title 30}} to truncate the title
  Handlebars.registerHelper('u', function () {
    var key = '';
    var args = Array.prototype.slice.call(arguments, 0);

    if (args.length) {
      key = args[0];
      // delete the util[functionName] as the first element in the array
      args.shift();
      // delete the options arguments passed by handlebars, which is the last argument
      args.pop();
    }
    if (util.hasOwnProperty(key)) {
      // notice the reference to util here
      return typeof util[key] == 'function' ?
        util[key].apply(util, args) :
        util[key];
    } else {
      log.error('util.' + key + ' is not a function nor a property');
    }
  });

// a helper to execute any util function as an if helper,
// that util function should have a boolean return if you want to use this properly
// usage: {{uif 'isNumber' this.age}} {{this.age}} {{else}} this.dob {{/uif}}
  Handlebars.registerHelper('uif', function () {
    var options = arguments[arguments.length - 1];
    return Handlebars.helpers['u'].apply(this, arguments) ? options.fn(this) : options.inverse(this);
  });

// a helper to execute any global function or get global.property
// say you have some globally accessible metadata i.e
// window.meta = {account: {state: 'MA', foo: function() { .. }, isBar: function() {...} } }
// usage:
// {{g 'meta.account.state'}} to print the state

// or will execute a function
// {{g 'meta.account.foo'}} to print whatever foo returns
  Handlebars.registerHelper('g', function () {
    var path, value;
    if (arguments.length) {
      path = arguments[0];
      delete arguments[0];

      // delete the options arguments passed by handlebars
      delete arguments[arguments.length - 1];
    }

    // notice the util.prop is required here
    value = util.prop(window, path);
    if (typeof value != 'undefined' && value !== null) {
      return typeof value == 'function' ?
        value.apply({}, arguments) :
        value;
    } else {
      log.warn('window.' + path + ' is not a function nor a property');
    }
  });

// global if
// usage:
// {{gif 'meta.account.isBar'}} // to execute isBar() and behave based on its truthy or not return
// or just check if a property is truthy or not
// {{gif 'meta.account.state'}} State is valid ! {{/gif}}
  Handlebars.registerHelper('gif', function () {
    var options = arguments[arguments.length - 1];
    return Handlebars.helpers['g'].apply(this, arguments) ? options.fn(this) : options.inverse(this);
  });

// just an {{#each}} warpper to iterate over a global array,
// usage say you have: window.meta = { data: { countries: [ {name: 'US', code: 1}, {name: 'UK', code: '44'} ... ] } }
// {{geach 'meta.data.countries'}} {{this.code}} {{/geach}}

  Handlebars.registerHelper('geach', function (path, options) {
    var value = util.prop(window, arguments[0]);
    if (!_.isArray(value))
      value = [];
    return Handlebars.helpers['each'].apply(this, [value, options]);
  });
})();

// adds .naturalWidth() and .naturalHeight() methods to jQuery
// for retreaving a normalized naturalWidth and naturalHeight.
(function($){
  var
    props = ['Width', 'Height'],
    prop;

  while (prop = props.pop()) {
    (function (natural, prop) {
      $.fn[natural] = (natural in new Image()) ?
        function () {
          return this[0][natural];
        } :
        function () {
          var
            node = this[0],
            img,
            value;

          if (node.tagName.toLowerCase() === 'img') {
            img = new Image();
            img.src = node.src;
            value = img[prop];
          }
          return value;
        };
    }('natural' + prop, prop.toLowerCase()));
  }
}(jQuery));

/* img scale for retina displays */
(function($) {
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
        //var src =  img.getAttribute('data-src') || img.getAttribute('src');
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
  }

  $.jFlex = $.jFlex || {};

  $.jFlex.retinaImg = changeSizeImgRetina;
})(jQuery);

/**
 * Text replacer
 */

//TODO сделать свою функци once
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  function ReplaceTextWithClass(options) {
    this.searchedEl = options.searchedEl;
    this.pattern = options.pattern;
    this.classes = options.classes;
    this.className = {
      processed: 'text-replacer-processed-' + counter
    };
  }
  ReplaceTextWithClass.prototype.run = function (parent) {
    var $prices = $(this.searchedEl, $(parent));
    var textNodes = [];
    var pattern = this.pattern;
    var _ = this;


    this.once($prices, function () {
      textNodes = textNodes.concat(_.textNodesUnder(this));
    });

    /*$prices.each(function () {
      textNodes = textNodes.concat(_.textNodesUnder(this));
    });*/

    textNodes.forEach(function (textNode) {
      _.replaceText(textNode, pattern);
    });
  };
  ReplaceTextWithClass.prototype.replaceText = function (textNode, pattern) {
    var text = textNode.textContent;
    var patternIndex = text.toUpperCase().indexOf(pattern.toUpperCase());
    var el = textNode.parentElement;

    if (!~patternIndex) return;

    textNode.textContent = this.trim(text.slice(0, patternIndex) + text.slice(patternIndex + pattern.length));

    this.classes
      .split(' ')
      .forEach(function (className) {
        el.classList.add(className);
      });
  };
  ReplaceTextWithClass.prototype.textNodesUnder = function (el) {
    var textNode;
    var textNodeArr = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    while (textNode = walk.nextNode()) textNodeArr.push(textNode);
    return textNodeArr;
  };
  ReplaceTextWithClass.prototype.trim = function (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
  ReplaceTextWithClass.prototype.once = function (el, func) {
    var className = this.className.processed;

    $(el).each(function () {
      var $currEl = $(this);

      if ($currEl.hasClass(className)) return;

      $currEl.addClass(className);
      func.call(this);
    });
  };

  var counter = 0;

  $.jFlex = $.jFlex || {};

  $.jFlex.textReplacer = function (options) {
    var textReplacer = new ReplaceTextWithClass(options);

    counter++;
    return textReplacer;
  };
});

/*
 * jQuery autoResize (textarea auto-resizer)
 * @copyright James Padolsey http://james.padolsey.com
 * @version 1.04
 */

/* autoResize textarea*/
(function($){

  $.fn.autoResize = function(options) {

    // Just some abstracted details,
    // to make plugin users happy:
    var settings = $.extend({
      onResize : function(){

      },
      animate : true,
      animateDuration : 150,
      animateCallback : function(){},
      extraSpace : 20,
      limit: 1000
    }, options);

    // Only textarea's auto-resize:
    this.filter('textarea').each(function(){

      // Get rid of scrollbars and disable WebKit resizing:
      var textarea = $(this).css({resize:'none','overflow-y':'hidden'}),

        // Cache original height, for use later:
        origHeight = textarea.height(),


        // Need clone of textarea, hidden off screen:
        clone = (function(){

          // Properties which may effect space taken up by chracters:
          var props = ['height','width','lineHeight','textDecoration','letterSpacing'],
            propOb = {};

          // Create object of styles to apply:
          $.each(props, function(i, prop){
            propOb[prop] = textarea.css(prop);
          });

          // Clone the actual textarea removing unique properties
          // and insert before original textarea:
          return textarea.clone().removeAttr('id').removeAttr('name').css({
            position: 'absolute',
            top: 0,
            left: -9999
          }).css(propOb).attr('tabIndex','-1').insertBefore(textarea);

        })(),
        lastScrollTop = null,
        updateSize = function() {
          // Prepare the clone:
          clone.height(0).val($(this).val()).scrollTop(10000);

          // Find the height of text:
          var scrollTop = Math.max(clone.scrollTop(), origHeight) + settings.extraSpace,
            toChange = $(this).add(clone);

          // Don't do anything if scrollTip hasen't changed:
          if (lastScrollTop === scrollTop) { return; }
          lastScrollTop = scrollTop;

          // Check for limit:
          if ( scrollTop >= settings.limit ) {
            $(this).css('overflow-y','');
            return;
          }
          // Fire off callback:
          settings.onResize.call(this);

          // Either animate or directly apply height:
          settings.animate && textarea.css('display') === 'block' ?
            toChange.stop().animate({height:scrollTop}, settings.animateDuration, settings.animateCallback)
            : toChange.height(scrollTop);


        };

      // Bind namespaced handlers to appropriate events:
      textarea
        .unbind('.dynSiz')
        .bind('keyup.dynSiz', updateSize)
        .bind('keydown.dynSiz', updateSize)
        .bind('change.dynSiz', updateSize);

    });

    // Chain:
    return this;

  };



})(jQuery);


/*ScrollUp button*/
(function($){
  function ScrollTop(options) {
    this._tpl = options.tpl || '<div id="scrollUp"><i class="upButton"></i></div>';
    this._animateSpeed = options.animateSpeed || 400;
    this._animateSpeedShow = options.animateSpeedShow || options.animateSpeed || 400;
    this._animateSpeedHide = options.animateSpeedHide || options.animateSpeed || 400;
    this._animateSpeedScroll = options.animateSpeedScroll || 500;
    this._offsetShow = options.offsetShow || '40px';
    this._offsetHide = options.offsetHide || '-20px';
    this._isActive = false;

    this.init();
  }
  ScrollTop.prototype.init = function () {
    this._$btn = $(this._tpl);
    $('body').append(this._$btn);

    this.scrollBtnToggler();

    this._$btn.on('click', this.scrollTop.bind(this));
    $(window).on('scroll', this.scrollBtnToggler.bind(this));
  };
  ScrollTop.prototype.scrollBtnToggler = function () {
    if ( $(document).scrollTop() > $(window).height() && !this._isActive ) {
      this._$btn.fadeIn({queue : false, duration: this._animateSpeedShow})
        .animate({'bottom' : this._offsetShow}, this._animateSpeedShow);
      this._isActive = true;
    } else if ( $(document).scrollTop() < $(window).height() && this._isActive ) {
      this._$btn.fadeOut({queue : false, duration: this._animateSpeedHide})
        .animate({'bottom' : this._offsetHide}, this._animateSpeedHide);
      this._isActive = false;
    }
  };
  ScrollTop.prototype.scrollTop = function(){
    $("html, body").animate({scrollTop: 0}, this._animateSpeedScroll);
    return false;
  };


  /*export*/
  $.scrollTopBtn = function (tpl) {
    return  new ScrollTop(tpl);
  };
})(jQuery);

/*remove class by part*/
(function ($) {
  $.fn.removeClassByMatch = function (pattern) {
    $(this).removeClass(function (_, className) {
      return (className.match(new RegExp('\\b' + pattern + '\\S+', 'g'))).join(' ');
    });
  };
})(jQuery);
