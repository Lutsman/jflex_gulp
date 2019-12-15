(function($) {

var floatyClone = {
        inits: [],
        savedShow: $.fn.show
    };
    
$.fn.show = function ()
{
    var res = floatyClone.savedShow.apply(this, arguments);
    floatyClone.redraw(this);
    return res;
}

$(window).on('scroll', function () {
    floatyClone.redraw(document);
});

$.fn.floatyClone = function(options) {
    this.init = function(options) {
        if (! this.length) return this;
        var defaultOptions = {
                elements: '',
                limiter: ''
            },
            data = this.data('floatyClone');
        
        if (! data) {
            data = {};
            this.data('floatyClone', data);
        }
        if (data.elements) this.destroy();
        
        data.self = this;
        data.options = $.extend({}, data.options || defaultOptions, options);
        data.id = floatyClone.inits.length;
        floatyClone.inits[data.id] = data;
    
        data.self.addClass('floatyClone');
        data.elements = (data.options.elements? $(data.options.elements, data.self): data.self).addClass('floatyClone-element');
        if (data.options.limiter) data.limiter = $(data.options.limiter);
        else if (data.elements.length) {
            data.limiter = data.elements.eq(0);
            while (data.limiter.find(data.elements).length < data.elements.length) data.limiter = data.limiter.parent();
            while (! data.limiter.is(document.body) && data.limiter.css('overflow') != 'hidden') data.limiter = data.limiter.parent();
        }
        else data.limiter = $(document.body);
        data.wrapper = data.limiter;
        if (data.wrapper.is(document.body)) {
            data.wrapper.addClass('floatyClone-wrapper');
        }
        else {
            while (data.wrapper.length && data.wrapper.get(0).nodeName.match(/td|th|tr|thead|tbody|tfoot/i)) data.wrapper = data.wrapper.parent();
            data.wrapper.wrap("<div class='floatyClone-wrapper'></div>");
            data.wrapper = data.wrapper.closest('.floatyClone-wrapper');
        }
        if (['absolute', 'relative'].indexOf(data.wrapper.css('position')) === -1) data.wrapper.css('position', 'relative');
        data.background = $("<div class='floatyClone-background'></div>").
            css({position: 'absolute', top: data.self.offset().top, left: data.self.offset().left, width: data.self.outerWidth(true), height: data.self.outerHeight(true), zIndex: 99}).
            appendTo(data.wrapper);
    
        data.elements.each(function () {
            var e = $(this),
                d = {self: e},
                c = e.clone().css({width: '100%', height: '100%', background: 'transparent', border: 'none'}).removeAttr('id'),
                w,
                p = e.css('position');
            e.data('floatyClone-element', d);
            if (p != 'absolute' && p != 'relative') e.css('position', 'relative');
            while (e.get(0).nodeName.match(/td|th|tr|thead|tbody|tfoot/i)) {
                e = e.parent();
                c = e.clone().css({width: '100%', height: '100%', background: 'transparent', border: 'none'}).removeAttr('id').empty().append(c);
                if (c.get(0).nodeName == 'TABLE') c.css('borderSpacing', 0);
            }
            c.wrap("<div class='floatyClone-element-wrapper'></div>");
            d.wrapper = c.closest('.floatyClone-element-wrapper').css({position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100}).appendTo(this);
        });
        
        floatyClone.redraw(data.self);
    }
    
    this.destroy = function() {
        var i, data = this.data('floatyClone');
        if (data) {
            if (data.elements) {
                data.elements.each(function () {
                    $($(this).data('floatyClone-element').wrapper).remove();
                }).removeClass('floatyClone-element');
            }
            if (data.background) data.background.remove();
            data.self.removeClass('floatyClone');
            if (data.wrapper.is(document.body)) data.wrapper.removeClass('floatyClone-wrapper');
            else data.wrapper.children().unwrap();
            delete(floatyClone.inits[data.id]);
            for (i in data) if (i !== 'options') delete(data[i]);
        }
        return this;
    }
    
    var data = this.data('floatyClone');
    if (! data || ! data.elements || options) this.init(options);
    
    return this;
};

floatyClone.redraw = function (context) {
    var a, n, data, global = $(context).is(document), local, visible, scrollTop = $(window).scrollTop();
    for (n in floatyClone.inits) {
        a = {};
        data = floatyClone.inits[n];
        local = false;
        visible = 0;
        data.elements.each(function () {
            if (global || $(this).closest(context).length > 0) {
                var d = $(this).data('floatyClone-element');
                d.wrapper.css({top: (scrollTop - d.wrapper.parent().offset().top) + 'px'});
                local = ! global;
            }
        });
        
        if (global || local) {
            data.elements.each(function () {
                var d = $(this).data('floatyClone-element'),
                    wrapperParentRect = d.wrapper.parent().is(':visible') && d.wrapper.parent().offset(),
                    wrapperRect = d.wrapper.is(':visible') && d.wrapper.offset();
                if (wrapperParentRect) {
                    if (scrollTop - wrapperParentRect.top < 0 || scrollTop + d.wrapper.outerHeight() > data.limiter.offset().top + data.limiter.innerHeight()) {
                        if (wrapperRect) d.wrapper.hide();
                        wrapperRect = false;
                    }
                    else {
                        if (! wrapperRect) {
                            d.wrapper.show();
                            wrapperRect = d.wrapper.is(':visible') && d.wrapper.offset();
                        }
                    }
                    if (wrapperRect) {
                        visible++;
                        if (typeof a.left === 'undefined' || a.left > wrapperRect.left) a.left = wrapperRect.left;
                        if (typeof a.top === 'undefined' || a.top > wrapperRect.top) a.top = wrapperRect.top;
                        wrapperRect.right = wrapperRect.left + d.wrapper.outerWidth();
                        wrapperRect.bottom = wrapperRect.top + d.wrapper.outerHeight();
                        if (typeof a.width === 'undefined' || a.width < wrapperRect.right - a.left) a.width = wrapperRect.right - a.left;
                        if (typeof a.height === 'undefined' || a.height < wrapperRect.bottom - a.top) a.height = wrapperRect.bottom - a.top;
                    }
                }
            });
            if (visible && data.background.is(':hidden')) data.background.show();
            else if (! visible && data.background.is(':visible')) data.background.hide();
            
            if (typeof a.left !== 'undefined' && 
                (! data.backgroundRect || a.left != data.backgroundRect.left || a.top != data.backgroundRect.top || 
                    a.width != data.backgroundRect.width || a.height != data.backgroundRect.height
                )) {
                data.backgroundRect = a;
                data.background.css({left: (a.left - parseInt(data.background.css('paddingLeft')) - data.wrapper.offset().left) + 'px', top: (a.top - parseInt(data.background.css('paddingTop')) - data.wrapper.offset().top) + 'px', width: a.width + 'px', height: a.height + 'px'});
                window.setTimeout(function () {
                    floatyClone.redraw(context);
                }, 100);
            }
        }
    }
}

    

})(jQuery);
