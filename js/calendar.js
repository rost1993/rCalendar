(function($){
	
	$.fn.myCalendar = function(options) {
		
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
		
		var config = $.extend({},{
			to: 'table-success',
			textMonth: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
			textDay: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
		}, options);


		
		function main(e) {
			
			// Проставляем текущую дату
			var now = new Date();
			var currentDate = config.textMonth[now.getMonth()] + ' ' + now.getFullYear();
			e.find('.my-calendar-toolbar-current-day').html(currentDate);
			
			// Проставляем номера недель
			var firstMonthDay = new Date(now.getFullYear(), now.getMonth(), 1);
			var lastMonthDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			var firstWeek = firstMonthDay.getWeek();
			
			/*var beforeMonthDay = new Date();
			beforeMonthDay.setMonth(beforeMonthDay.getMonth() - 1);*/
			
			e.find('.number-week').each(function() {
				$(this).html(firstWeek++);
			});

			var j = 1;
			for(var i = firstMonthDay.getDate(); i <= lastMonthDay.getDate(); i++) {
				var temp = new Date(firstMonthDay.getFullYear(), firstMonthDay.getMonth(), i);
				e.find('.my-calendar-week-' + j).find('.' + config.textDay[temp.getDay()]).html(i);
				e.find('.my-calendar-week-' + j).find('.' + config.textDay[temp.getDay()]).removeClass('r-calendar-disable-day').addClass('r-calendar-day');
				
				if(now.getDate() == i)
					e.find('.my-calendar-week-' + j).find('.' + config.textDay[temp.getDay()]).removeClass('r-calendar-disable-day').addClass('r-calendar-current-day');
				
				if(temp.getDay() == 0)
					j++;
			}
		};
		
		this.each(function() { main($(this)); });
		return this;
	
	};
	
	
	
	$.fn.rCalendar = function(options) {
		
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
		
		var config = $.extend({},{
			to: 'table-success',
			textMonth: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
			textDay: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
		}, options);
		
		function main(e) {
			
		};
		
		this.each(function() { main($(this)); });
		return this;
	};
	
	
})(jQuery);