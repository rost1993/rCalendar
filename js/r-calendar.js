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

	var defaults = {
		textMonth: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
		textMonth2: ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'],
		textDay: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
		textDayRussian: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
		textDayAllRussian: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
		timeDay: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
	};


	var _renderingToolbar = function(e, year, month, day, period) {
		// Текущая дата
		var now = new Date();
		
		// Дата по которой надо строить календарь
		var mainDate;
		if(year != -1 && month != -1 && day != -1)
			mainDate = new Date(year, month, day);
		else
			mainDate = new Date();
		
		var rCalendarToolbar = $("<div class='r-calendar-toolbar'>");
			
		var rCalendarToolbarLeftBlock = $("<div class='r-calendar-toolbar-right r-calendar-group-btn'>");
		rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn' id='btnBeforeDate' data-period='" + period + "' data-year='" + mainDate.getFullYear() + "' data-month='" + mainDate.getMonth() + "' data-day='" + mainDate.getDate() + "' type='button'><</button>");
		rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn' id='btnAfterDate' data-period='" + period + "' data-year='" + mainDate.getFullYear() + "' data-month='" + mainDate.getMonth() + "' data-day='" + mainDate.getDate() + "' type='button'>></button>");

		rCalendarToolbarLeftBlock.append("<button class='btn btn-sm r-calendar-btn r-calendar-btn-today' id='btnNowDate' data-period='" + period + "' data-year='" + now.getFullYear() + "' data-month='" + now.getMonth() + "' data-day='" + now.getDate() + "' type='button'>Сегодня</button>");
		rCalendarToolbarLeftBlock.append("</div>");
		
		rCalendarToolbarLeftBlock.find('#btnBeforeDate').unbind('click', methods.beforeDatePeriod);
		rCalendarToolbarLeftBlock.find('#btnBeforeDate').on('click', methods.beforeDatePeriod);
		rCalendarToolbarLeftBlock.find('#btnAfterDate').unbind('click', methods.afterDatePeriod);
		rCalendarToolbarLeftBlock.find('#btnAfterDate').on('click', methods.afterDatePeriod);
		
		rCalendarToolbarLeftBlock.find('#btnNowDate').unbind('click', methods.nowDatePeriod);
		rCalendarToolbarLeftBlock.find('#btnNowDate').on('click', methods.nowDatePeriod);
		
		rCalendarToolbar.append(rCalendarToolbarLeftBlock);

		var rCalendarToolbarCenterBlock = $("<div class='r-calendar-toolbar-center'>");
		var flgBtnGridMonth, flgBtnGridWeek, flgBtnGridDay;
		flgBtnGridMonth = flgBtnGridWeek = flgBtnGridDay = '';
		
		if(period == 'month') {
			flgBtnGridMonth = 'disabled';
			rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + defaults.textMonth[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
		} else if(period == 'day') {
			flgBtnGridDay = 'disabled';
			rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + mainDate.getDate() + "&nbsp;" + defaults.textMonth2[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
		} else {
			var tt = mainDate;
			do {
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
			} while(mainDate.getWeek() == tt.getWeek());
			tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
			
			var weekText = tt.getDate() + "&nbsp;" + defaults.textMonth2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
			
			tt = mainDate;
			do {
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
			} while(mainDate.getWeek() != tt.getWeek());
			tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
			weekText += "&nbsp;-&nbsp;" + tt.getDate() + "&nbsp;" + defaults.textMonth2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
			
			flgBtnGridWeek = 'disabled';
			rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + weekText + "</strong></span>");
		}
		
		rCalendarToolbarCenterBlock.append("</div>");
		rCalendarToolbar.append(rCalendarToolbarCenterBlock);
			
		var rCalendarToolbarRightBlock = $("<div class='r-calendar-toolbar-left r-calendar-group-btn'>");
		rCalendarToolbarRightBlock.append("<div class='btn-group' role='group'>");
		rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridMonth + "' type='button' id='btnGridMonth' data-period='month'>Месяц</button>");
		rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridWeek + "' type='button' id='btnGridWeek' data-period='week'>Неделя</button>");
		rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn " + flgBtnGridDay + "' type='button' id='btnGridDay' data-period='day'>День</button>");
		//rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn' type='button'>Повестка дня</button>");
		rCalendarToolbarRightBlock.append("</div>");
		rCalendarToolbarRightBlock.append("</div>");
		
		rCalendarToolbarRightBlock.find('#btnGridMonth').unbind();
		rCalendarToolbarRightBlock.find('#btnGridMonth').on('click', methods.nowDatePeriod);
		
		rCalendarToolbarRightBlock.find('#btnGridWeek').unbind();
		rCalendarToolbarRightBlock.find('#btnGridWeek').on('click', methods.nowDatePeriod);
		
		rCalendarToolbarRightBlock.find('#btnGridDay').unbind();
		rCalendarToolbarRightBlock.find('#btnGridDay').on('click', methods.nowDatePeriod);
		
		rCalendarToolbar.append(rCalendarToolbarRightBlock);

		rCalendarToolbar.append("</div>");
		e.html(rCalendarToolbar);
	};
	
	var methods = {
		init: function(e, year, month, day, period){
			
			if(e === undefined)
				return;
			
			e.empty();
			
			if(period != 'month' || period != 'day' || period != 'year')
				period = 'month';
			
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate;
			if(year != -1 && month != -1 && day != -1)
				mainDate = new Date(year, month, day);
			else
				mainDate = new Date();

			var thead = $("<div class='r-calendar-thead'>");			

			thead.append("<div class='r-calendar-thead-day' style='width:5%;'>#</div>");
			
			for(var i = 0; i < 7; i++)
				thead.append("<div class='r-calendar-thead-day'>" + defaults.textDayRussian[i] + "</div>");
			thead.append("</div>");
			
			_renderingToolbar(e, year, month, day, period);
			
			var rCalendarWidget = $("<div class='r-calendar-widget'>");
			rCalendarWidget.append(thead);
			
			var tbody = $("<div class='r-calendar-body'>");
			
			// Проставляем номера недель
			var firstMonthDay = new Date(mainDate.getFullYear(), mainDate.getMonth(), 1);
			var lastMonthDay = new Date(mainDate.getFullYear(), mainDate.getMonth() + 1, 0);
			var firstWeek = firstMonthDay.getWeek();

			var daysRCalendar = [];
			
			for(var i = 0; i < 6; i++) {
				daysRCalendar[i] = [];
				for(var j = 0; j < 7; j++) {
					daysRCalendar[i][j] = [];
					daysRCalendar[i][j]['value'] = 0;
					daysRCalendar[i][j]['class'] = 'r-calendar-day-disable';
					daysRCalendar[i][j]['date'] = '0000-00-00';
				}
			}
			
			var j = 0;
			for(var i = firstMonthDay.getDate(); i <= lastMonthDay.getDate(); i++) {
				var temp = new Date(firstMonthDay.getFullYear(), firstMonthDay.getMonth(), i);
				
				daysRCalendar[j][temp.getDay()]['value'] = i;
				daysRCalendar[j][temp.getDay()]['class'] = 'r-calendar-day-active';
				daysRCalendar[j][temp.getDay()]['date'] = temp.getFullYear() + '-' + temp.getMonth() + '-' + temp.getDate();
				
				if((now.getDate() == temp.getDate()) && (now.getFullYear() == temp.getFullYear()) && (now.getMonth() == temp.getMonth()))
					daysRCalendar[j][temp.getDay()]['class'] += ' r-calendar-current-day';
				
				if(temp.getDay() == 0)
					j++;
			}
			
			// Последний порядковый номер недели текущего месяца (нужен чтобы дозаполнить следующий месяц)
			var lastWeekCurrentMonth = j;
			
			// Отрисовываем предыдущий месяц
			j = 0;
			var beforeDate = new Date(firstMonthDay.getFullYear(), firstMonthDay.getMonth(), 0);
			for(var i = beforeDate.getDay(); i > 0 ; i--, j++) {
				var temp = new Date(beforeDate.getFullYear(), beforeDate.getMonth(), (beforeDate.getDate() - j));
				daysRCalendar[0][temp.getDay()]['value'] = temp.getDate();
				daysRCalendar[0][temp.getDay()]['class'] = 'r-calendar-day-disable';
			}
			
			// Отрисовываем следующи месяц
			j = 0;
			var afterDate = new Date(lastMonthDay.getFullYear(), (lastMonthDay.getMonth() + 1), 1);
			for(var i = lastWeekCurrentMonth; i < 6; i++) {

				do {
					var temp = new Date(afterDate.getFullYear(), afterDate.getMonth(), (afterDate.getDate() + j));
					daysRCalendar[i][temp.getDay()]['value'] = temp.getDate();
					daysRCalendar[i][temp.getDay()]['class'] = 'r-calendar-day-disable';
					j++;
				} while(temp.getDay() != 0);
			}

			for(var i = 0; i < 6; i++) {
				tbody.append("<div class='r-calendar-week-" + i + "'>" + 
				"<div class='r-calendar-day number-week' style='width: 5%;'>" + (firstWeek++) + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][1]['class'] + "' data-date='" + daysRCalendar[i][1]['date'] + "'>" + daysRCalendar[i][1]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][2]['class'] + "' data-date='" + daysRCalendar[i][2]['date'] + "'>" + daysRCalendar[i][2]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][3]['class'] + "' data-date='" + daysRCalendar[i][3]['date'] + "'>" + daysRCalendar[i][3]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][4]['class'] + "' data-date='" + daysRCalendar[i][4]['date'] + "'>" + daysRCalendar[i][4]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][5]['class'] + "' data-date='" + daysRCalendar[i][5]['date'] + "'>" + daysRCalendar[i][5]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][6]['class'] + "' data-date='" + daysRCalendar[i][6]['date'] + "'>" + daysRCalendar[i][6]['value'] + "</div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][0]['class'] + "' data-date='" + daysRCalendar[i][0]['date'] + "'>" + daysRCalendar[i][0]['value'] + "</div>" +
				"</div>");
			}
			tbody.append("</div>");
			rCalendarWidget.append(tbody);
			rCalendarWidget.append("</div>");

			rCalendarWidget.appendTo(e);

			return e;
		},
		
		// Метод для вычисления предыдущего периода
		beforeDatePeriod: function() {
			var period = $(this).data('period');
			
			var year, month, day;
			year = ($(this).data('year') === undefined) ? -1 : $(this).data('year');
			month = ($(this).data('month') === undefined) ? -1 : $(this).data('month');
			day = ($(this).data('day') === undefined) ? -1 : $(this).data('day');
			
			if(year == -1 || month == -1 || day == -1)
				return;

			var tempDate;
			if(period == 'month') {
				tempDate = new Date(year, (month - 1), day);
			} else if(period == 'day') {
				tempDate = new Date(year, month, (day - 1));
			} else if(period == 'week') {
				tempDate = new Date(year, month, day);
				var tt = tempDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
				} while(tempDate.getWeek() == tt.getWeek());
				tempDate = tt;
			}

			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			if(period == 'month')
				methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else if(period == 'day')
				methods.initDay(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else
				methods.initWeek(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
		},
		
		// Метод для вычисления следующего периода
		afterDatePeriod: function() {
			var period = $(this).data('period');
			var year, month, day;
			year = ($(this).data('year') === undefined) ? -1 : $(this).data('year');
			month = ($(this).data('month') === undefined) ? -1 : $(this).data('month');
			day = ($(this).data('day') === undefined) ? -1 : $(this).data('day');
			
			if(year == -1 || month == -1 || day == -1)
				return;

			var tempDate;
			if(period == 'month') {
				tempDate = new Date(year, (month + 1), day);
			} else if(period == 'day') {
				tempDate = new Date(year, month, (day + 1));
			} else if(period == 'week') {
				tempDate = new Date(year, month, day);
				var tt = tempDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
				} while(tempDate.getWeek() == tt.getWeek());
				tempDate = tt;
			}

			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			if(period == 'month')
				methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else if(period == 'day')
				methods.initDay(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else
				methods.initWeek(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
		},
		
		nowDatePeriod: function() {
			var period = $(this).data('period');
			tempDate = new Date();
			
			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			if(period == 'month')
				methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else if(period == 'day')
				methods.initDay(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), period);
			else if(period == 'week')
				methods.initWeek(rCalendar,tempDate.getFullYear(),tempDate.getMonth(), tempDate.getDate(), period);
		},
		
		initDay: function(e, year, month, day, period) {
			
			_renderingToolbar(e, year, month, day, period);
			
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate;
			if(year != -1 && month != -1 && day != -1)
				mainDate = new Date(year, month, day);
			else
				mainDate = new Date();
			
			var rCalendarWidget = $("<div class='r-calendar-widget'>");
			var thead = $("<div class='r-calendar-thead'>"
				+ "<div class='r-calendar-daytime-grid-thead r-calendar-daytime-grid-10'>Время</div>"
				+ "<div class='r-calendar-daytime-grid-thead r-calendar-daytime-grid-90'>" + defaults.textDayAllRussian[mainDate.getDay()] + "</div>"
				+ "</div>");
			
			rCalendarWidget.append(thead);
			
			var tbody = $("<div class='r-calendar-body'>");
			for(var i = 0; i < 24; i++) {
				tbody.append("<div class='r-calendar-daytime'>"
					+ "<div class='r-calendar-daytime-grid r-calendar-daytime-grid-10'>" + defaults.timeDay[i] + "</div>"
					+ "<div class='r-calendar-daytime-grid r-calendar-daytime-grid-90'></div>"
					+ "</div>");
			}
			tbody.append("</div>");
			rCalendarWidget.append(tbody);
			
			rCalendarWidget.appendTo(e);
		},
		
		initWeek: function(e, year, month, day, period) {
			
			_renderingToolbar(e, year, month, day, period);
			
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate;
			if(year != -1 && month != -1 && day != -1)
				mainDate = new Date(year, month, day);
			else
				mainDate = new Date();

			// Определяем деня начала недели
			var tt = mainDate;
			do {
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
			} while(mainDate.getWeek() == tt.getWeek());
			mainDate = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
			
			var rCalendarWidget = $("<div class='r-calendar-widget'>");
			var thead = $("<div class='r-calendar-thead'>");
			thead.append("<div class='r-calendar-week-grid-thead r-calendar-week-grid-10'>&nbsp;</div>");
			
			for(var i = 0; i < 7; i++) {
				var tempDate = new Date(mainDate.getFullYear(), mainDate.getMonth(), (mainDate.getDate() + i));
				thead.append("<div class='r-calendar-week-grid-thead r-calendar-week-grid-12'>" + defaults.textDayRussian[i] + "&nbsp;" + tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "</div>");
			}
			thead.append("</div>");
			
			rCalendarWidget.append(thead);
			
			var tbody = $("<div class='r-calendar-body'>");
			for(var i = 0; i < 24; i++) {
				tbody.append("<div class='r-calendar-week'>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-10'>" + defaults.timeDay[i] + "</div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12'></div>"
					+ "</div>");
			}
			tbody.append("</div>");
			rCalendarWidget.append(tbody);
			
			rCalendarWidget.appendTo(e);
		}
	};
	
	$.fn.rCalendar = function(options) {
		var options = $.extend({
			year: -1,
			month: -1,
			day: -1,
			period: 'week'
		}, options);
		
		//return methods.init($(this), options.year, options.month, options.day, options.period);
		//return methods.initDay($(this), options.year, options.month, options.day, options.period);
		return methods.initWeek($(this), options.year, options.month, options.day, options.period);

		
		
		/*function main(e) {
			
		};
		this.each(function() { main($(this)); });
		return this;*/
	};
	
	
})(jQuery);