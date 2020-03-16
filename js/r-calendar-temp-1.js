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
		textDay: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
		textDayRussian: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
	};

	var methods = {
		init: function(e, year, month, day, period) {
			
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
			rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + defaults.textMonth[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
			rCalendarToolbarCenterBlock.append("</div>");
			rCalendarToolbar.append(rCalendarToolbarCenterBlock);
			
			var rCalendarToolbarRightBlock = $("<div class='r-calendar-toolbar-left r-calendar-group-btn'>");
			rCalendarToolbarRightBlock.append("<div class='btn-group' role='group'>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn' type='button'>Месяц</button>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn' type='button'>Неделя</button>");
			rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn' type='button'>День</button>");
			//rCalendarToolbarRightBlock.append("<button class='btn btn-sm r-calendar-btn' type='button'>Повестка дня</button>");
			rCalendarToolbarRightBlock.append("</div>");
			rCalendarToolbarRightBlock.append("</div>");
			rCalendarToolbar.append(rCalendarToolbarRightBlock);

			rCalendarToolbar.append("</div>");
			e.html(rCalendarToolbar);
			
			var table = $("<table class='table table-bordered text-center'>");			

			var tr = $("<tr>");
			var th = $("<th style='width:50px;'>#</th>");
			tr.append(th);
			
			for(var i = 0; i < 7; i++) {
				var th = $("<th>" + defaults.textDayRussian[i] + "</th>");
				tr.append(th);
			}
			tr.append("</tr>");
			
			var thead = $("<thead>");
			thead.append(tr);
			thead.append("</thead>");
			table.append(thead);
			
			var tbody = $("<tbody>");

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
					daysRCalendar[i][j]['class'] = 'r-calendar-disable-day';
					daysRCalendar[i][j]['date'] = '0000-00-00';
				}
			}
			
			var j = 0;
			for(var i = firstMonthDay.getDate(); i <= lastMonthDay.getDate(); i++) {
				var temp = new Date(firstMonthDay.getFullYear(), firstMonthDay.getMonth(), i);
				
				daysRCalendar[j][temp.getDay()]['value'] = i;
				daysRCalendar[j][temp.getDay()]['class'] = 'r-calendar-day';
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
				daysRCalendar[0][temp.getDay()]['class'] = 'r-calendar-disable-day';
			}
			
			// Отрисовываем следующи месяц
			j = 0;
			var afterDate = new Date(lastMonthDay.getFullYear(), (lastMonthDay.getMonth() + 1), 1);
			for(var i = lastWeekCurrentMonth; i < 6; i++) {

				do {
					var temp = new Date(afterDate.getFullYear(), afterDate.getMonth(), (afterDate.getDate() + j));
					daysRCalendar[i][temp.getDay()]['value'] = temp.getDate();
					daysRCalendar[i][temp.getDay()]['class'] = 'r-calendar-disable-day';
					j++;
				} while(temp.getDay() != 0);
			}

			for(var i = 0; i < 6; i++) {
				var tr = $("<tr class='r-calendar-week-" + i + "'>");
				tr.append("<td class='number-week'>" + (firstWeek++) + "</td>");
				tr.append("<td class='" + daysRCalendar[i][1]['class'] + "' data-date='" + daysRCalendar[i][1]['date'] + "'>" + daysRCalendar[i][1]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][2]['class'] + "' data-date='" + daysRCalendar[i][2]['date'] + "'>" + daysRCalendar[i][2]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][3]['class'] + "' data-date='" + daysRCalendar[i][3]['date'] + "'>" + daysRCalendar[i][3]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][4]['class'] + "' data-date='" + daysRCalendar[i][4]['date'] + "'>" + daysRCalendar[i][4]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][5]['class'] + "' data-date='" + daysRCalendar[i][5]['date'] + "'>" + daysRCalendar[i][5]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][6]['class'] + "' data-date='" + daysRCalendar[i][6]['date'] + "'>" + daysRCalendar[i][6]['value'] + "</td>");
				tr.append("<td class='" + daysRCalendar[i][0]['class'] + "' data-date='" + daysRCalendar[i][0]['date'] + "'>" + daysRCalendar[i][0]['value'] + "</td>");
				tr.append("</tr>");
				
				tbody.append(tr);
			}

			tbody.append("</tbody>");
			table.append(tbody);
			table.append("</table>");
			
			var rCalendarWidget = $("<div class='r-calendar-widget'>");
			rCalendarWidget.append(table);
			rCalendarWidget.append("</div>");

			rCalendarWidget.appendTo(e);

			return e;
		},
		
		// Метод для вычисления предыдущего периода
		beforeDatePeriod: function() {
			var year, month, day;
			year = ($(this).data('year') === undefined) ? -1 : $(this).data('year');
			month = ($(this).data('month') === undefined) ? -1 : $(this).data('month');
			day = ($(this).data('day') === undefined) ? -1 : $(this).data('day');
			
			if(year == -1 || month == -1 || day == -1)
				return;

			tempDate = new Date(year, (month - 1), day);
			
			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
		},
		
		// Метод для вычисления следующего периода
		afterDatePeriod: function() {
			var year, month, day;
			year = ($(this).data('year') === undefined) ? -1 : $(this).data('year');
			month = ($(this).data('month') === undefined) ? -1 : $(this).data('month');
			day = ($(this).data('day') === undefined) ? -1 : $(this).data('day');
			
			if(year == -1 || month == -1 || day == -1)
				return;

			tempDate = new Date(year, (month + 1), day);
			
			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
		},
		
		nowDatePeriod: function() {
			tempDate = new Date();
			
			var rCalendar = $(this).closest('.r-calendar');
			if(rCalendar === undefined)
				return;

			methods.init(rCalendar, tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
		},
		
		initDay: function(e, year, month, day, period) {
			
			for(var i = 0;i < 24; i++) {
				
			}
			
		}
	};
	
	$.fn.rCalendar = function(options) {
		var options = $.extend({
			year: -1,
			month: -1,
			day: -1,
			period: 'month'
		}, options);
		
		//return methods.init($(this), options.year, options.month, options.day, options.period);
		return methods.init($(this), options.year, options.month, options.day, options.period);
		
		/*function main(e) {
			
		};
		this.each(function() { main($(this)); });
		return this;*/
	};
	
	
})(jQuery);