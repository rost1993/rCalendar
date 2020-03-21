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
			language: 'ru',
			startDay: new Date(),
			view: 'months'
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
			this._defineLocale(this.opts.language);
			
			this._renderingToolBar();
		},
		
		_defineLocale: function(lang) {
			if(typeof lang == 'string') {
				this.loc = $.fn.rCalendar.language[lang];
				
				if(!this.loc) {
					console.warn('Can\'t find language "' + lang + '" in rCalendar.language, will use "ru" instead');
					this.loc = $.extend(true, {}, $.fn.rCalendar.language.ru)
				}
				
				this.loc = $.extend(true, {}, $.fn.rCalendar.language.ru, $.fn.rCalendar.language[lang])
			} else {
				this.loc = $.extend(true, {}, $.fn.rCalendar.language.ru, lang)
			}
		},
		
		_renderingToolBar: function() {
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate = this.opts.startDay;
			if(mainDate === undefined)
				mainDate = new Date();
			
			var rCalendarToolbar = $("<div class='r-calendar-toolbar'>");
			
			var rCalendarToolbarLeftBlock = $("<div class='r-calendar-toolbar-right r-calendar-group-btn'>");
			rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn' id='btnBeforeDate' data-period='' data-year='" + mainDate.getFullYear() + "' data-month='" + mainDate.getMonth() + "' data-day='" + mainDate.getDate() + "' type='button'><</button>");
			rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn' id='btnAfterDate' data-period='' data-year='" + mainDate.getFullYear() + "' data-month='" + mainDate.getMonth() + "' data-day='" + mainDate.getDate() + "' type='button'>></button>");
	
			rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn r-calendar-btn-today' id='btnNowDate' data-period='' data-year='" + now.getFullYear() + "' data-month='" + now.getMonth() + "' data-day='" + now.getDate() + "' type='button'>" + this.loc.today + "</button>");
			rCalendarToolbarLeftBlock.append("</div>");
			
			/*rCalendarToolbarLeftBlock.find('#btnBeforeDate').unbind('click', methods.beforeDatePeriod);
			rCalendarToolbarLeftBlock.find('#btnBeforeDate').on('click', methods.beforeDatePeriod);
			rCalendarToolbarLeftBlock.find('#btnAfterDate').unbind('click', methods.afterDatePeriod);
			rCalendarToolbarLeftBlock.find('#btnAfterDate').on('click', methods.afterDatePeriod);
			
			rCalendarToolbarLeftBlock.find('#btnNowDate').unbind('click', methods.nowDatePeriod);
			rCalendarToolbarLeftBlock.find('#btnNowDate').on('click', methods.nowDatePeriod);*/
			
			rCalendarToolbar.append(rCalendarToolbarLeftBlock);
	
			var rCalendarToolbarCenterBlock = $("<div class='r-calendar-toolbar-center'>");
			var flgBtnGridMonth, flgBtnGridWeek, flgBtnGridDay;
			flgBtnGridMonth = flgBtnGridWeek = flgBtnGridDay = '';
		
			if(this.opts.view == 'months') {
				flgBtnGridMonth = 'disabled';
				rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + this.loc.months[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
			} else if(this.opts.view == 'days') {
				flgBtnGridDay = 'disabled';
				rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + mainDate.getDate() + "&nbsp;" + this.loc.months[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
			} else {
				var tt = mainDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
				} while(mainDate.getWeek() == tt.getWeek());
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
				
				//var weekText = tt.getDate() + "&nbsp;" + defaults.textMonth2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				var weekText = tt.getDate() + "&nbsp;" + this.loc.months[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				
				tt = mainDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
				} while(mainDate.getWeek() == tt.getWeek());
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
				//weekText += "&nbsp;-&nbsp;" + tt.getDate() + "&nbsp;" + defaults.textMonth2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				weekText += "&nbsp;-&nbsp;" + tt.getDate() + "&nbsp;" + this.loc.months[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				
				flgBtnGridWeek = 'disabled';
				rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + weekText + "</strong></span>");
			}
		
			rCalendarToolbarCenterBlock.append("</div>");
			rCalendarToolbar.append(rCalendarToolbarCenterBlock);
				
			var rCalendarToolbarRightBlock = $("<div class='r-calendar-toolbar-left r-calendar-group-btn'>");
			rCalendarToolbarRightBlock.append("<div class='btn-group' role='group'>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridMonth + "' type='button' id='btnGridMonth' data-period='month'>" + this.loc.month + "</button>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridWeek + "' type='button' id='btnGridWeek' data-period='week'>" + this.loc.week + "</button>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridDay + "' type='button' id='btnGridDay' data-period='day'>" + this.loc.day + "</button>");
			rCalendarToolbarRightBlock.append("</div>");
			rCalendarToolbarRightBlock.append("</div>");
			
			rCalendarToolbarRightBlock.find('#btnGridMonth').unbind();
			rCalendarToolbarRightBlock.find('#btnGridMonth').on('click', this.selectMonth.bind(this));
			
			rCalendarToolbarRightBlock.find('#btnGridWeek').unbind();
			rCalendarToolbarRightBlock.find('#btnGridWeek').on('click', this.selectWeek.bind(this));
			
			rCalendarToolbarRightBlock.find('#btnGridDay').unbind();
			rCalendarToolbarRightBlock.find('#btnGridDay').on('click', this.selectDay.bind(this));
			
			rCalendarToolbar.append(rCalendarToolbarRightBlock);
	
			rCalendarToolbar.append("</div>");
			rCalendarToolbar.appendTo(this.$el);
			//e.html(rCalendarToolbar);
		},
		
		update: function(e) {
			e._renderingToolBar();
		},
		
		selectMonth: function(e) {
			e.view = "months";
			e.update(e);
		},
		
		selectWeek: function(e) {
			e.view = "weeks";
			e.update(e);
		},
		
		selectDay: function(e) {
			e.view = "days";
			e.update(e);
		},
	};
	
	$.fn.rCalendar = function(options) {
		return this.each(function() {
			if(!$.data(this, pluginName)) {
				$.data(this, pluginName, new rCalendar(this, options));
			} else {
				var _this = $.data(this, pluginName);
				
				_this.opts = $.extend(true, _this.opts, options);
				//_this.update();
			}
		});
	};
	
	$.fn.rCalendar.language = {
		ru: {
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			daysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
			months: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
			monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			today: 'Сегодня',
			month: 'Месяц',
			week: 'Неделя',
			day: 'День'
		},
		
		en: {
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			months: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
			monthsShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
			today: 'Today',
			month: 'Month',
			week: 'Week',
			day: 'Day'
		}
	};
	
	
})(jQuery);