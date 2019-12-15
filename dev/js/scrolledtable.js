(function($) {

$.fn.scrolledTable = function(options) {

    this.init = function(options) {
        var defaultOptions = {
                fixedLeft: 0,
                texts: {
                    moreColumns: ['Больше нет колонок', 'Ещё {1} колонка', 'Ещё {1} колонки', 'Ещё {1} колонок']
                },
                navigationTemplate: "<span class='scrolledTable-navigation-text scrolledTable-text scrolledTable-text-moreColumns-hidden'></span> <span class='scrolledTable-navigation-controls'><a href='#' class='scrolledTable-navigation-sctollLeft'>&larr;</a> <a href='#' class='scrolledTable-navigation-sctollRight'>&rarr;</a></span>",
                duration: 400
            },
            data = this.data('scrolledTable');
        
        if (! data) {
            data = {};
            this.data('scrolledTable', data);
        }
        if (data.columns) this.destroy();
        
        data.self = this;
        data.options = $.extend({}, data.options || defaultOptions, options);
        data.columns = [];
    
        data.self.addClass('scrolledTable');
        if (! data.wrapper && ! (data.wrapper = data.self.closest('.scrolledTable-wrapper')).length) {
            data.self.wrap("<div class='scrolledTable-wrapper'></div>");
            data.wrapper = data.self.closest('.scrolledTable-wrapper');
        }
        /*data.self.add(data.self.children('thead,tbody,tfoot')).find('> tr > td[colspan],> tr > th[colspan]').each(function() {
            var i, count = parseInt($(this).attr('colspan'));
            $(this).removeAttr('colspan');
            for (i = 1; i < count; i++) $(this).clone().insertAfter(this);
        });*/
        data.wrapperWidth = data.wrapper.innerWidth() - parseInt(data.wrapper.css('paddingLeft')) - parseInt(data.wrapper.css('paddingRight'));
        data.borderSpacing = parseInt(data.self.css('borderSpacing'));
        data.borderCollapse = data.self.css('borderCollapse') == 'collapse';
        
        data.self.add(data.self.children('thead,tbody,tfoot')).find('> tr:first,> tr:first').eq(0).find('> td,> th').each(function(index) {
            var cells = data.self.add(data.self.children('thead,tbody,tfoot')).find('> tr > td:not([colspan]):nth-child(' + (index + 1) + '),> tr > th:not([colspan]):nth-child(' + (index + 1) + ')');
            data.columns[index] = {cells: cells.show(), hidden: false};
            data.columns[index].scrolledIndex = Math.max(-1, index - data.options.fixedLeft);
            data.columns[index].width = $(this).outerWidth(true) + parseInt($(this).css('borderLeftWidth')) + parseInt($(this).css('borderRightWidth')) + data.borderSpacing;
        });
        for (var i in data.columns) {
            data.columns[i].cellsRep = $("<td></td>").css({width: data.columns[i].width, padding: 0, display: 'none'}).data({scrolledTable: {table: data.self, column: i}}).insertAfter(data.columns[i].cells);
        }
        data.total = data.columns.length;
        
        this.scroll(0, 0);
        return this;
    }
    
    this.destroy = function() {
        var i, data = this.data('scrolledTable');
        if (data) {
            if (data.columns) {
                for (i in data.columns) {
                    data.columns[i].cellsRep.remove();
                    data.columns[i].cells.show();
                }
            }
            if (data.navigation) data.navigation.remove();
            data.self.removeClass('scrolledTable');
            data.self.unwrap();
            for (i in data) if (i !== 'options') delete(data[i]);
        }
        return this;
    }
    
    this.scroll = function(index, duration) {
        var i, width = 0, data = this.data('scrolledTable');
        if (! data || ! data.columns) return false;
        if (index === 'left') index = (data.scrolledTo || 0) - 1;
        if (index === 'right') index = (data.scrolledTo || 0) + 1;
        index = Math.min(data.columns.length - 1, Math.max(0, index));
        if (typeof duration === 'undefined' || duration === true || duration === null) duration = data.options.duration;
        else duration = parseInt(duration);
        data.hidden = 0;
        data.hiddenLeft = 0;
        data.hiddenRight = 0;
        data.shownFrom = -1;
        data.shownTo = -1;
        for (i = 0; i < data.columns.length; i++) {
            if (data.columns[i].scrolledIndex >= 0 && data.columns[i].scrolledIndex < index) {
                if (! data.columns[i].hidden) {
                    data.columns[i].hidden = true;
                    data.columns[i].cells.hide();
                    if (duration) data.columns[i].cellsRep.css({width: data.columns[i].width}).show().
                        animate({width: 0}, duration, function () { $(this).hide(); });
                }
                data.hidden++;
                data.hiddenLeft++;
            }
            else if (width + data.columns[i].width <= data.wrapperWidth) {
                width += data.columns[i].width;
                if (data.shownFrom < 0 && data.columns[i].scrolledIndex >= 0) data.shownFrom = i;
                data.shownTo = i;
                if (data.columns[i].hidden) {
                    data.columns[i].hidden = false;
                    if (duration) data.columns[i].cellsRep.css({width: 0}).show().
                        animate({width: data.columns[i].width}, duration, function () {
                            var d = $(this).data('scrolledTable'), data = d.table.data('scrolledTable');
                            data.columns[d.column].cells.show();
                            $(this).hide();
                        });
                    else data.columns[i].cells.show();
                }
            }
            else {
                width += data.columns[i].width;
                if (! data.columns[i].hidden) {
                    data.columns[i].hidden = true;
                    data.columns[i].cells.hide();
                    if (duration) data.columns[i].cellsRep.css({width: data.columns[i].width}).show().
                        animate({width: 0}, duration, function () { $(this).hide(); });
                }
                data.hidden++;
                data.hiddenRight++;
            }
        }
        if (data.hidden) data.wrapper.removeClass('scrolledTable-noScroll');
        else data.wrapper.addClass('scrolledTable-noScroll');
        if (data.hiddenLeft) data.wrapper.removeClass('scrolledTable-noLeftScroll');
        else data.wrapper.addClass('scrolledTable-noLeftScroll');
        if (data.hiddenRight) data.wrapper.removeClass('scrolledTable-noRightScroll');
        else data.wrapper.addClass('scrolledTable-noRightScroll');
        
        data.scrolledTo = index;
        
        if (! data.navigation && ! (data.navigation = data.wrapper.children('.scrolledTable-navigation')).length) {
            data.navigation = $("<div class='scrolledTable-navigation'>" + data.options.navigationTemplate + "</div>").appendTo(data.wrapper);
            $('.scrolledTable-navigation-sctollLeft').click(function() { if (data.hiddenLeft) data.self.scroll('left'); return false; });
            $('.scrolledTable-navigation-sctollRight').click(function() { if (data.hiddenRight) data.self.scroll('right'); return false; });
        }
        $('.scrolledTable-text', data.navigation).each(function () {
            var d = ($(this).attr('class').split('scrolledTable-text-', 2)[1] || '').split(' ', 1)[0].split('-'),
                text = data.options.texts[d[0]] || '',
                value = data[d[1]] || '',
                plural, i;
                
            if (typeof text === 'object') {
                plural = typeof value === 'number' ? (value == 0? 0: (value % 10 == 1 && value % 100 != 11? 1: (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)? 2: 3))): 0
                while (typeof text[plural] === 'undefined' && plural > 0) plural--;
                text = text[plural];
            }
            
            console.log(data['hidden'])
            
            for (i = 1; i < d.length; i++){
                
                text = text.replace('{' + i + '}', typeof data[d[i]] !== 'undefined'? (d[i] == 'total' ? data['hidden'] + 1 : data[d[i]]) : '?');
            }
            
            $(this).html(text);
        });
        
        return this;
    };
    
    var data = this.data('scrolledTable');
    if (! data || ! data.columns || options) this.init(options);
    
    return this;
};


})(jQuery);
