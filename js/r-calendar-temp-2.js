(function($){
	
	Date.prototype.getWeek = function() {
		var date = new Date(this.getTime());
		date.setHours(0, 0, 0, 0);
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
								- 3 + (week1.getDay() + 6) % 7) / 7);
	}


	var VERSION = '1.0',
		pluginName = 'rCalendar',
		defaults = {
			language: 'ru'
		}, rCalendar;
	
	
	var rCalendar = function(el, options) {
		this.el = el;
        this.$el = $(el);
		
		this.opts = $.extend(true, {}, defaults, options, this.$el.data());
		
		this.init();
	};
	
	rCalendar = rCalendar;
	
	rCalendar.prototype = {
		VERSION: VERSION,
		
		init: function() {
			alert(this.opts.language);
		},
	};
	
	$.fn.rCalendar = function(options) {
		return this.each(function() {
			if(!$.data(this, pluginName)){
				$.data(this,  pluginName,
                    new rCalendar( this, options ));
			} else {
				var _this = $.data(this, pluginName);
				
				_this.opts = $.extend(true, _this.opts, options);
				_this.update();
			}
		});
	};
	
	
})(jQuery);