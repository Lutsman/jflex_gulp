(function($) {

$.fn.compactTable = function (options) {
    this.init = function(options) {
        if (! this.length) return this;
        var defaultOptions = {
                visibleRows: 1  ,
                columnsLimit: 'none',
                fixedLeft: 0
            },
            data = this.data('compactTable');
        
        if (! data) {
            data = {};
            this.data('compactTable', data);
        }
        if (data.visibleRows) this.destroy();
        
        var i, j, n = {};
        data.self = this;
        data.self.addClass('compactTable');
        if (! data.wrapper && ! (data.wrapper = data.self.closest('.compactTable-wrapper')).length) {
            data.self.wrap('<div class="compactTable-wrapper"></div>');
            data.wrapper = data.self.closest('.compactTable-wrapper');
        }
        data.options = $.extend({}, data.options || defaultOptions, options);
        if (typeof data.options.visibleRows === 'string') data.options.visibleRows = data.options.visibleRows.split(',');
        else if (typeof data.options.visibleRows === 'number') data.options.visibleRows = [data.options.visibleRows];
        for (i in data.options.visibleRows) {
            if (typeof data.options.visibleRows[i] !== 'number') data.options.visibleRows[i] = parseInt(data.options.visibleRows[i]);
            if (data.options.visibleRows[i]) n[data.options.visibleRows[i] - 1] = true;
        }
        
        data.visibleRows = $();
        data.hiddenRows = $();
        $('> tr,> thead > tr,> tbody > tr,> tfoot > tr', data.self).each(function (index) {
            if (index in n) {
                data.visibleRows = data.visibleRows.add(this);
                delete(n[index]);
            }
            else data.hiddenRows = data.hiddenRows.add(this);
        });
        if (! data.visibleRows.length) return this;
        n = data.visibleRows.eq(0).find('> td, > th');
        var totalColumns = n.length,
            brakes = 1;
        if (data.options.columnsLimit == 'auto') {
            
            
            if(data.visibleRows.filter(':first').find('td.new-line').length > 0){
                data.columnsLimit = data.visibleRows.filter(':first').find('td.new-line').index() - 1;
            }else data.columnsLimit = Math.floor(totalColumns *
                (data.wrapper.innerWidth() - parseInt(data.wrapper.css('paddingLeft')) - parseInt(data.wrapper.css('paddingRight')) - n.eq(data.options.fixedLeft).position().left) /
                (n.last().position().left - n.eq(data.options.fixedLeft).position().left + n.last().outerWidth(true)));
        }
        else data.columnsLimit = data.options.columnsLimit == 'none'? totalColumns: parseInt(data.options.columnsLimit);
        brakes = Math.ceil((totalColumns - data.options.fixedLeft) / data.columnsLimit)
        
        data.hiddenRows.hide();
        data.tmpRows = $();
        for (i = 1; i < brakes; i++) {
            n = data.visibleRows.clone().appendTo(data.visibleRows.eq(0).parent());
            n.find('> td, > th').html('&nbsp;');
            data.tmpRows = data.tmpRows.add(n);
            for (j = 0; j < data.columnsLimit && i * data.columnsLimit + j < totalColumns - data.options.fixedLeft; j++) {
                data.visibleRows.each(function (index) {
                    var a = $(this).find('> td, > th'),
                        b = n.eq(index).find('> td, > th');
                    a.eq(i * data.columnsLimit + j + data.options.fixedLeft).clone().replaceAll(b.eq(j + data.options.fixedLeft));
                })
            }
            n.each(function () {
                $(this).find('> td, > th').slice(data.options.fixedLeft + data.columnsLimit).hide();
                if (j < data.columnsLimit) $(this).find('> td, > th').slice(j + data.options.fixedLeft).css({background: 'transparent', border: 'none'});
            });
        }
        data.visibleRows.each(function () { $(this).find('> td, > th').slice(data.options.fixedLeft + data.columnsLimit).hide(); });
        return this;
    }

    this.destroy = function () {
        var i, data = this.data('compactTable');
        if (data) {
            this.modeOn = false;
            data.hiddenRows.show();
            data.visibleRows.find('> td, > th').show();
            data.tmpRows.remove();
            data.self.removeClass('compactTable');
            data.self.unwrap();
            for (i in data) if (i !== 'options') delete(data[i]);
            return this;
        }
    };
    
    
    var data = this.data('compactTable');
    if (! data || ! data.visibleRows || options) this.init(options);
    
    return this;
};


    

})(jQuery);
