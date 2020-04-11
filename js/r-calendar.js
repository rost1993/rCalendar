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
			view: 'months',
			selectTable: [],
			selectCustomer: [],
			handlersScript: 'handlers-events.php',
			arrayDataEvents: []
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
		
		// Инициализации начлаьного состояния календаря
		init: function() {
			this._defineLocale(this.opts.language);
			this._renderingToolBar();
			this._renderingWidget();
			this._bindEvents();
		},
		
		// Установка локали для языка
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
		
		// Отрисовка верхнего меню интерфейса для кнопок 
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
			
			rCalendarToolbarLeftBlock.find('#btnBeforeDate').unbind();
			rCalendarToolbarLeftBlock.find('#btnBeforeDate').on('click', this.prev);
			rCalendarToolbarLeftBlock.find('#btnAfterDate').unbind();
			rCalendarToolbarLeftBlock.find('#btnAfterDate').on('click', this.next);
			
			rCalendarToolbarLeftBlock.find('#btnNowDate').unbind();
			rCalendarToolbarLeftBlock.find('#btnNowDate').on('click', this.today);
			
			rCalendarToolbar.append(rCalendarToolbarLeftBlock);
	
			var rCalendarToolbarCenterBlock = $("<div class='r-calendar-toolbar-center'>");
			var flgBtnGridMonth, flgBtnGridWeek, flgBtnGridDay;
			flgBtnGridMonth = flgBtnGridWeek = flgBtnGridDay = '';

			if(this.opts.view == 'months') {
				flgBtnGridMonth = 'disabled';
				rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + this.loc.months[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
			} else if(this.opts.view == 'days') {
				flgBtnGridDay = 'disabled';
				rCalendarToolbarCenterBlock.append("<span class='r-calendar-toolbar-current-day'><strong>" + mainDate.getDate() + "&nbsp;" + this.loc.months2[mainDate.getMonth()] + "&nbsp;" + mainDate.getFullYear() + "</strong></span>");
			} else {
				var tt = mainDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
				} while(mainDate.getWeek() == tt.getWeek());
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));

				var weekText = tt.getDate() + "&nbsp;" + this.loc.months2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				
				tt = mainDate;
				do {
					tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
				} while(mainDate.getWeek() == tt.getWeek());
				tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
				weekText += "&nbsp;-&nbsp;" + tt.getDate() + "&nbsp;" + this.loc.months2[tt.getMonth()] + "&nbsp;" + tt.getFullYear();
				
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
			rCalendarToolbarRightBlock.find('#btnGridMonth').on('click', this.selectMonth);
			
			rCalendarToolbarRightBlock.find('#btnGridWeek').unbind();
			rCalendarToolbarRightBlock.find('#btnGridWeek').on('click', this.selectWeek);
			
			rCalendarToolbarRightBlock.find('#btnGridDay').unbind();
			rCalendarToolbarRightBlock.find('#btnGridDay').on('click', this.selectDay);
			
			rCalendarToolbar.append(rCalendarToolbarRightBlock);
	
			rCalendarToolbar.append("</div>");
			this.$el.html(rCalendarToolbar);
		},
		
		// Отрисовка основного содержимого календаря
		_renderingWidget:function() {
			switch(this.opts.view){
				case 'months':
					this._renderingWidgetMonths();
					break;
				
				case 'weeks':
					this._renderingWidgetWeeks();
					break;
				
				case 'days':
					this._renderingWidgetDays();
					break;
				
				default:
					this._renderingWidgetMonths();
					break;
			}
		},
		
		// Отрисовка в режиме "Месяц"
		_renderingWidgetMonths: function() {
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate = this.opts.startDay;
			if(mainDate === undefined)
				mainDate = new Date();

			var thead = $("<div class='r-calendar-thead'>");			

			thead.append("<div class='r-calendar-thead-day' style='width:5%;'>#</div>");
			
			for(var i = 0; i < 7; i++)
				thead.append("<div class='r-calendar-thead-day'>" + this.loc.daysShort[i] + "</div>");
			thead.append("</div>");
			
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
				"<div class='r-calendar-day " + daysRCalendar[i][1]['class'] + "' data-date='" + daysRCalendar[i][1]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][1]['value'] + "</span><span class='r-calendar-badge'>События: 2</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][2]['class'] + "' data-date='" + daysRCalendar[i][2]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][2]['value'] + "</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][3]['class'] + "' data-date='" + daysRCalendar[i][3]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][3]['value'] + "</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][4]['class'] + "' data-date='" + daysRCalendar[i][4]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][4]['value'] + "</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][5]['class'] + "' data-date='" + daysRCalendar[i][5]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][5]['value'] + "</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][6]['class'] + "' data-date='" + daysRCalendar[i][6]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][6]['value'] + "</span></div>" +
				"<div class='r-calendar-day " + daysRCalendar[i][0]['class'] + "' data-date='" + daysRCalendar[i][0]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][0]['value'] + "</span></div>" +
				"</div>");
			}
			tbody.append("</div>");		
			rCalendarWidget.append(tbody);
			rCalendarWidget.append("</div>");

			rCalendarWidget.appendTo(this.$el);
		},
		
		// Отрисовка в режиме "Неделя"
		_renderingWidgetWeeks: function() {
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate = this.opts.startDay;
			if(mainDate === undefined)
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
			
			var arrayDate = [];
			
			for(var i = 0; i < 7; i++) {
				var tempDate = new Date(mainDate.getFullYear(), mainDate.getMonth(), (mainDate.getDate() + i));
				thead.append("<div class='r-calendar-week-grid-thead r-calendar-week-grid-12'>" + this.loc.daysShort[i] + "&nbsp;" + tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "</div>");
				arrayDate[i] = tempDate.getFullYear() + "-" + tempDate.getMonth() + "-" + tempDate.getDate();
			}
			thead.append("</div>");
			
			rCalendarWidget.append(thead);
			var tbody = $("<div class='r-calendar-body'>");
			for(var i = 0; i < 24; i++) {
				tbody.append("<div class='r-calendar-week'>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-10' data-time='" + this.loc.hours[i] + "'>" + this.loc.hours[i] + "</div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[0] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[1] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[2] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[3] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[4] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[5] + "'></div>"
					+ "<div class='r-calendar-week-grid r-calendar-week-grid-12 r-calendar-day-active' data-date='" + arrayDate[6] + "'></div>"
					+ "</div>");
			}
			tbody.append("</div>");
			rCalendarWidget.append(tbody);
			
			rCalendarWidget.appendTo(this.$el);
		},
		
		// Отрисовка в режиме "День"
		_renderingWidgetDays: function() {
			// Текущая дата
			var now = new Date();
			
			// Дата по которой надо строить календарь
			var mainDate = this.opts.startDay;
			if(mainDate === undefined)
				mainDate = new Date();

			var rCalendarWidget = $("<div class='r-calendar-widget'>");
			var thead = $("<div class='r-calendar-thead'>"
				+ "<div class='r-calendar-daytime-grid-thead r-calendar-daytime-grid-10'>" + this.loc.time + "</div>"
				+ "<div class='r-calendar-daytime-grid-thead r-calendar-daytime-grid-90'>" + this.loc.days[mainDate.getDay()] + "</div>"
				+ "</div>");
			
			rCalendarWidget.append(thead);
			
			var tbody = $("<div class='r-calendar-body'>");
			for(var i = 0; i < 24; i++) {
				tbody.append("<div class='r-calendar-daytime'>"
					+ "<div class='r-calendar-daytime-grid r-calendar-daytime-grid-10' data-time='" + this.loc.hours[i] + "'>" + this.loc.hours[i] + "</div>"
					+ "<div class='r-calendar-daytime-grid r-calendar-daytime-grid-90 r-calendar-daytime-active' data-date='" + mainDate.getFullYear() + "-" + mainDate.getMonth() + "-" + mainDate.getDate() + "'></div>"
					+ "</div>");
			}
			tbody.append("</div>");
			rCalendarWidget.append(tbody);
			rCalendarWidget.appendTo(this.$el);
		},
		
		// Метод навешивания событий
		_bindEvents: function() {
			this.$el.find('.r-calendar-day-active,.r-calendar-daytime-active').unbind();
			this.$el.find('.r-calendar-day-active,.r-calendar-daytime-active').on('click', { mode : "add" }, this.showModalWindow);
		},
		
		// Обновление HTML кода календаря
		update: function() {
			this._renderingToolBar();
			this._renderingWidget();
			this._bindEvents();
		},
		
		// Переключение на режим отображения "месяц"
		selectMonth: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			if(rCalendar.opts.view == 'months')
				return;
			
			rCalendar.opts.view = 'months';
			rCalendar.update();
		},
		
		// Переключение на режим отображения "неделя"
		selectWeek: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			if(rCalendar.opts.view == 'weeks')
				return;
			
			rCalendar.opts.view = 'weeks';
			rCalendar.update();
		},
		
		// Переключение на режим отображения "день"
		selectDay: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			if(rCalendar.opts.view == 'days')
				return;
			
			rCalendar.opts.view = 'days';
			rCalendar.update();
		},
	
		// Отрисовка модального окна
		showModalWindow: function(event) {
			
			// Если обработчик сработал на тэге SPAN то переключаем в режим дня
			if(event.target.tagName.toUpperCase() == 'SPAN' && event.target.className == 'r-calendar-text-day'){
				var split_date = $(this).closest('.r-calendar-day').data('date').split('-');
				var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
				rCalendar.opts.startDay = new Date(split_date[0], split_date[1], split_date[2]);
				rCalendar.opts.view = 'days';
				rCalendar.update();
				return;
			}
			
			if(event.target.tagName.toUpperCase() == 'SPAN' && event.target.className == 'r-calendar-badge') {
				var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
				rCalendar.showModalWindowListEvents($(this).data('date'));
				return;
			}
			
			var selectedDate, selectTableList, selectCustomerList, selectedHour, selectedMinute;
			
			var startDate, startDateHour, startDateMinute, endDate, endDateHour, endDateMinute, nameReservation, numberTableReservation, customerReservation, commentReservation, idReservation;
			startDate = startDateHour = startDateMinute = endDate = endDateHour = endDateMinute = nameReservation = numberTableReservation = customerReservation = commentReservation = '';
			
			// Указатель на класс rCalendar, будем получать взависимости от режима работы
			var rCalendar;
			
			// Кнопка удаления мероприятия
			var btnRemoveEvent = "";
			
			if(event.data.mode == "add") {
				// Устанавливаем событие для закрытия окошка
				rCalendar = $(this).closest('.r-calendar').data('rCalendar');

				// Получаем выбранную дату
				var startDate = rCalendar.getDateToNormalFormat($(this).data('date'));
				
				if(rCalendar.opts.view == 'weeks') {
					var temp = $(this).closest('.r-calendar-week').find('.r-calendar-week-grid-10').data('time');
					var tempSplit = (temp === undefined) ? '00:00'.split(':') : temp.split(':');
					startDateHour = (tempSplit.length > 1) ? tempSplit[0] : '00';
					startDateMinute = (tempSplit.length > 1) ? tempSplit[1] : '00';
					endDateHour = startDateHour;
					endDateMinute = startDateMinute;
				} else if(rCalendar.opts.view == 'days') {
					var temp = $(this).closest('.r-calendar-daytime').find('.r-calendar-daytime-grid-10').data('time');
					var tempSplit = (temp === undefined) ? '00:00'.split(':') : temp.split(':');
					startDateHour = (tempSplit.length > 1) ? tempSplit[0] : '00';
					startDateMinute = (tempSplit.length > 1) ? tempSplit[1] : '00';
					endDateHour = startDateHour;
					endDateMinute = startDateMinute;
				} else {
					startDateHour = startDateMinute = endDateHour = endDateMinute = '00';
				}

				endDate = startDate;
				idReservation = -1;
			} else if(event.data.mode == "update") {
				
				rCalendar = event.data.rCalendar;
				
				startDate = (event.data.arrayEvent['startDate'] === undefined) ? '' : event.data.arrayEvent['startDate'];
				startDateHour = (event.data.arrayEvent['startDateHour'] === undefined) ? '' : event.data.arrayEvent['startDateHour'];
				startDateMinute = (event.data.arrayEvent['startDateMinute'] === undefined) ? '' : event.data.arrayEvent['startDateMinute'];
				
				endDate = (event.data.arrayEvent['endDate'] === undefined) ? '' : event.data.arrayEvent['endDate'];
				endDateHour = (event.data.arrayEvent['endDateHour'] === undefined) ? '' : event.data.arrayEvent['endDateHour'];
				endDateMinute = (event.data.arrayEvent['endDateMinute'] === undefined) ? '' : event.data.arrayEvent['endDateMinute'];
				
				nameReservation = (event.data.arrayEvent['nameReservation'] === undefined) ? '' : event.data.arrayEvent['nameReservation'];
				numberTableReservation = (event.data.arrayEvent['numberTableReservation'] === undefined) ? '' : event.data.arrayEvent['numberTableReservation'];
				customerReservation = (event.data.arrayEvent['customerReservation'] === undefined) ? '' : event.data.arrayEvent['customerReservation'];
				commentReservation = (event.data.arrayEvent['commentReservation'] === undefined) ? '' : event.data.arrayEvent['commentReservation'];
				
				idReservation = (event.data.arrayEvent['id'] === undefined) ? -1 : event.data.arrayEvent['id'];
				
				btnRemoveEvent = "<button type='button' class='btn btn-warning' id='btnRemoveEvent' data-id='" + idReservation + "' style='margin-right: 10px;'>Удалить</button>";
			} else {
				return;
			}

			// Разбираем список столов
			try {
				var temp = JSON.parse(rCalendar.opts.selectTable);
				selectTableList = "<option value='0'></option>";
				for(var key in temp) {
					if(key == numberTableReservation || temp[key] == numberTableReservation)
						selectTableList += "<option value='" + key + "' selected>" + temp[key] + "</option>";
					else
						selectTableList += "<option value='" + key + "'>" + temp[key] + "</option>";
				}
			} catch{
				selectTableList = "<option value=''></option>";
				if(typeof(rCalendar.opts.selectTable) === 'object') {
					var temp = eval(rCalendar.opts.selectTable);
					for(var i = 0; i < temp.length; i++) {
						if(temp[i] == numberTableReservation)
							selectTableList += "<option value='" + temp[i] + "' selected>" + temp[i] + "</option>";
						else
							selectTableList += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
					}
				}
			}
			
			// Разбираем список клиентов
			try {
				var temp = JSON.parse(rCalendar.opts.selectCustomer);
				selectCustomerList = "<option value='0'></option>";
				for(var key in temp) {
					if(key == customerReservation || temp[key] == customerReservation)
						selectCustomerList += "<option value='" + key + "' selected>" + temp[key] + "</option>";
					else
						selectCustomerList += "<option value='" + key + "'>" + temp[key] + "</option>";
				}
			} catch {
				selectCustomerList = "<option value=''></option>"
				if(typeof(rCalendar.opts.selectCustomer) === 'object') {
					var temp = eval(rCalendar.opts.selectCustomer);
					for(var i = 0; i < temp.length; i++) {
						if(temp[i] == customerReservation)
							selectCustomerList += "<option value='" + temp[i] + "' selected>" + temp[i] + "</option>";
						else
							selectCustomerList += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
					}
				}
			}
			
			var modal = $("<div class='r-calendar-modal r-calendar-modal-show'>"
			+ "<div class='r-calendar-modal-dialog r-calendar-modal-dialog-centered'>"
				+ "<div class='r-calendar-modal-content'>"
					+ "<div class='r-calendar-modal-header'><div class='r-calendar-modal-title'>Бронирование стола</div><button class='r-calendar-close'>&times;</button></div>"
					+ "<div class='r-calendar-modal-body'>"
					
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Начало бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='startDate' maxlength='10' style='width: 20%;' placeholder='ДД.ММ.ГГГГ' value='" + startDate + "' data-mandatory='true' data-datatype='date'>"
								+ "<span class='r-calendar-input-group-text'>ч.</span>"
								+ "<input type='number' class='r-calendar-form-control' id='startDateHour' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='23' step='1' value='" + startDateHour + "' data-mandatory='true' data-datatype='number'>"
								+ "<span class='r-calendar-input-group-text'>м.</span>"
							+ "<input type='number' class='r-calendar-form-control' id='startDateMinute' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='59' step='1' value='" + startDateMinute + "' data-mandatory='true' data-datatype='number'>"
						+ "</div>"
						
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Окончание бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='endDate' maxlength='10' style='width: 20%;' placeholder='ДД.ММ.ГГГГ' value='" + endDate + "' data-mandatory='true' data-datatype='date'>"
								+ "<span class='r-calendar-input-group-text'>ч.</span>"
								+ "<input type='number' class='r-calendar-form-control' id='endDateHour' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='23' step='1' value='" + endDateHour + "' data-mandatory='true' data-datatype='number'>"
								+ "<span class='r-calendar-input-group-text'>м.</span>"
							+ "<input type='number' class='r-calendar-form-control' id='endDateMinute' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='59' step='1' value='" + endDateMinute + "' data-mandatory='true' data-datatype='number'>"
						+ "</div>"
					
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Название бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='nameReservation' data-mandatory='true' data-datatype='char' value='" + nameReservation + "'>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Номер стола</label>"
							+ "<select class='r-calendar-form-control' id='numberTableReservation' data-datatype='number'>" + selectTableList + "</select>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Клиенты</label>"
							+ "<select class='r-calendar-form-control' id='customerReservation' data-datatype='number'>" + selectCustomerList + "</select>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Комментарий</label>"
							+ "<textarea class='r-calendar-form-control' rows='3' id='commentReservation' data-datatype='char'>" + commentReservation + "</textarea>"
						+ "</div>"
						
						+ "<div class='r-calendar-form-row'>"
							+ "<div class='r-calendar-modal-text-error'></div>"
						+ "</div>"
						
					+ "</div>"
					+ "<div class='r-calendar-modal-footer'>"
						+ "<button class='btn btn-success' id='btnSaveData' data-id='" + idReservation + "' style='margin-right: 10px;'>Сохранить</button>"
						+ btnRemoveEvent
						+ "<button class='btn btn-danger' id='btnCloseModalWindow'>Закрыть</button>"
					+ "</div>"
				+ "</div>"
			+ "</div>"
			+ "</div>");

			$(modal).find('.r-calendar-close').unbind();
			$(modal).find('.r-calendar-close').on('click', rCalendar.closeModalWindow);

			$(modal).find("[type='number']").unbind();
			$(modal).find("[type='number']").on('input', rCalendar.checkValueTime);
			
			$(modal).find('#btnSaveData').unbind();
			$(modal).find('#btnSaveData').on('click', { rCalendar : rCalendar }, rCalendar.save);
			
			$(modal).find('#btnCloseModalWindow').unbind();
			$(modal).find('#btnCloseModalWindow').on('click', rCalendar.closeModalWindow);
			
			$(modal).find('#btnRemoveEvent').unbind();
			$(modal).find('#btnRemoveEvent').on('click', { rCalendar : rCalendar }, rCalendar.remove);

			$('body').append(modal);
			if(!$('body').is('.r-calendar-modal-backdrop'))
				$('body').append($("<div class='r-calendar-modal-backdrop'></div>"));
			$('body').addClass('r-calendar-modal-open');
		},
		
		// Отрисовка модального окна с мероприятими
		showModalWindowListEvents: function(date) {
			if(date === undefined)
				return;
			
			var selectedDate = this.getDateToNormalFormat(date);
			//var html = "";

			var html_table_events = $("<div class='r-calendar-form-row'></div>");
				
			var table_events = $("<table class='table table-sm table-bordered text-center table-hover'></table>");
			var thead = $("<thead><tr>"
				+ "<th>№ п/п</th>"
				+ "<th>Начало</th>"
				+ "<th>Окончание</th>"
				+ "<th>Название</th>"
				+ "<th>№ стола</th>"
				+ "<th>Клиент</th>"
				+ "</tr></thead>");
			var tbody = $("<tbody></tbody>");

			var arrayEvents = this.getEventsSelectedDate(selectedDate);
			
			for(var i = 0; i < arrayEvents.length; i++) {
				var tr =  $("<tr class='r-calendar-tr-events' id='" + arrayEvents[i]['id'] + "'>"
					  + "<td>" + (i + 1) + "</td>"
					  + "<td>" + arrayEvents[i]['startDate'] + "&nbsp;" + arrayEvents[i]['startDateHour'] + ":" + arrayEvents[i]['startDateMinute'] + "</td>"
					  + "<td>" + arrayEvents[i]['endDate'] + "&nbsp;" + arrayEvents[i]['endDateHour'] + ":" + arrayEvents[i]['endDateMinute'] + "</td>"
					  + "<td>" + arrayEvents[i]['nameReservation'] + "</td>"
					  + "<td>" + arrayEvents[i]['numberTableReservation'] + "</td>"
					  + "<td>" + arrayEvents[i]['customerReservation'] + "</td>"
					  + "</tr>");
				
				$(tbody).append(tr);
				$(tbody).find('#' + arrayEvents[i]['id']).unbind();
				$(tbody).find('#' + arrayEvents[i]['id']).on('click', { "mode" : "update", arrayEvent : arrayEvents[i], rCalendar : this }, this.showModalWindow);
			}
			
			$(table_events).append(thead);
			$(table_events).append(tbody);
			$(html_table_events).append(table_events);
			
			var modal_body = $("<div class='r-calendar-modal-body'></div>");
			$(modal_body).append(html_table_events);
			
			var modal = $("<div class='r-calendar-modal r-calendar-modal-show'></div>");
			var modal_dialog = $("<div class='r-calendar-modal-dialog-2 r-calendar-modal-dialog-centered'></div>");
			var modal_content = $("<div class='r-calendar-modal-content'></div>");
			var modal_header = $("<div class='r-calendar-modal-header'><div class='r-calendar-modal-title'>Список бронирований на&nbsp;" + selectedDate + "</div><button class='r-calendar-close'>&times;</button></div>");
			var modal_footer = $("<div class='r-calendar-modal-footer'><button class='btn btn-danger' id='btnCloseModalWindow'>Закрыть</button></div>");

			$(modal_content).append(modal_header);
			$(modal_content).append(modal_body);
			$(modal_content).append(modal_footer);
			$(modal_dialog).append(modal_content);
			$(modal).append(modal_dialog);
			
			$(modal).find('.r-calendar-close').unbind();
			$(modal).find('.r-calendar-close').on('click', this.closeModalWindow);
			
			$(modal).find('#btnCloseModalWindow').unbind();
			$(modal).find('#btnCloseModalWindow').on('click', this.closeModalWindow);

			$('body').append(modal);
			
			if(!$('body').is('.r-calendar-modal-backdrop'))
				$('body').append($("<div class='r-calendar-modal-backdrop'></div>"));
		},
		
		// Функция получения массива бронирований по выбранной дате
		getEventsSelectedDate: function(selectedDate) {
			var arrayEvents = [];
			var date = this.getObjectDate(selectedDate);
			
			try {
				var arrayDataEvents = JSON.parse(this.opts.arrayDataEvents);

				for(var item in arrayDataEvents) {
					var dateStart = this.getObjectDate(arrayDataEvents[item]['startDate']);
					var dateEnd = this.getObjectDate(arrayDataEvents[item]['endDate']);

					if(date >= dateStart && date <= dateEnd) {
						var temp = [];
						
						temp['startDate'] = (arrayDataEvents[item]['startDate'] === undefined) ? '' : arrayDataEvents[item]['startDate'];
						temp['startDateHour'] = (arrayDataEvents[item]['startDateHour'] === undefined) ? '' : arrayDataEvents[item]['startDateHour'];
						temp['startDateMinute'] = (arrayDataEvents[item]['startDateMinute'] === undefined) ? '' : arrayDataEvents[item]['startDateMinute'];
						temp['endDate'] = (arrayDataEvents[item]['endDate'] === undefined) ? '' : arrayDataEvents[item]['endDate'];
						temp['endDateHour'] = (arrayDataEvents[item]['endDateHour'] === undefined) ? '' : arrayDataEvents[item]['endDateHour'];
						temp['endDateMinute'] = (arrayDataEvents[item]['endDateMinute'] === undefined) ? '' : arrayDataEvents[item]['endDateMinute'];
						temp['nameReservation'] = (arrayDataEvents[item]['nameReservation'] === undefined) ? '' : arrayDataEvents[item]['nameReservation'];
						temp['numberTableReservation'] = (arrayDataEvents[item]['numberTableReservation'] === undefined) ? '' : arrayDataEvents[item]['numberTableReservation'];
						temp['customerReservation'] = (arrayDataEvents[item]['customerReservation'] === undefined) ? '' : arrayDataEvents[item]['customerReservation'];
						temp['id'] = (arrayDataEvents[item]['id'] === undefined) ? '0' : arrayDataEvents[item]['id'];

						arrayEvents.push(temp);
					}
				}
			} catch {
				arrayEvents = [];
			}
			
			return arrayEvents;
		},
		
		// Функция проверки ввода времени на корректность
		checkValueTime: function() {
			var x = (/\d+/i.exec($(this).val()) === null) ? 0 : String(/\d+/i.exec($(this).val())).substr(0, 2);
			if(x == 0)
				$(this).val($(this).val().substr(0, 2));
			else
				$(this).val((Number(x) > Number($(this).prop('max'))) ? $(this).prop('max'): (x == 0) ? '' : x);
		},
		
		// Проверка даты на корректность
		// Дата в формате dd.mm.yyyy
		checkValueDate: function(date) {
			if(String(date).length == 0)
				return true;

			if(String(date).length < 10)
				return false;

			var dd_split = String(date).split('.');
			if(dd_split.length < 3)
				return false;

			dd_split[1] -= 1;
			var dd = new Date(dd_split[2], dd_split[1], dd_split[0]);
			if((dd.getFullYear() == dd_split[2]) && (dd.getMonth() == dd_split[1]) && (dd.getDate() == dd_split[0]))
				return true;
			else
				return false;
		},
		
		// Функция проверка вводимых данных пользователем
		saveCheckData: function(modalWindow, rCalendar) {
			var flgCheck = true;
			var messageError = '';
			var arrSaveItem = {};
			
			// Пробегаемся по всем элементам чтобы сбросить класс ошибок
			$(modalWindow.find('input,select,textarea')).each(function() {
				$(this).removeClass('r-calendar-field-error');
			});
			// Очищаем поле для вывода ошибок
			$(modalWindow).find('.r-calendar-modal-text-error').html('');
			
			$(modalWindow.find('input,select,textarea')).each(function() {
				$(this).removeClass('r-calendar-field-error');
				if($(this).data('mandatory')) {
					if($(this).prop('tagName').toUpperCase() == 'SELECT') {
						if($(this).val() == 0 || $(this).val() === undefined || $(this).val() == null) {
							messageError = 'Не заполнено поле: ' + $(this).closest('.r-calendar-form-row').find('label').html();
							$(this).addClass('r-calendar-field-error');
							flgCheck = false;
							return false;
						}
					} else {
						if($(this).val().trim().length == 0) {
							messageError = 'Не заполнено поле: ' + $(this).closest('.r-calendar-form-row').find('label').html();
							$(this).addClass('r-calendar-field-error');
							flgCheck = false;
							return false;
						}
					}
					
					if($(this).data('datatype') == 'date') {
						if(!rCalendar.checkValueDate($(this).val())) {
							messageError = "Неверный формат даты";
							$(this).addClass('r-calendar-field-error');
							flgCheck = false;
							return false;
						}
					}
					
					var nameItem = $(this).prop('id');
					var arrayTemp = '';
					
					if($(this).prop('type') == 'CHECKBOX')
						arrayTemp = $(this).prop('checked');
					else
						arrayTemp = $(this).val().trim().toUpperCase();

					arrSaveItem[nameItem] = arrayTemp;
				} else {
					var nameItem = $(this).prop('id');
					var arrayTemp = '';
					
					if($(this).prop('tagName').toUpperCase() == 'SELECT') {
						arrayTemp['value'] = $(this).val();
					} else {
						if(($(this).prop('type').toUpperCase() == 'CHECKBOX') || ($(this).prop('type').toUpperCase() == 'RADIO'))
							arrayTemp = $(this).prop('checked');
						else
							arrayTemp = $(this).val().trim().toUpperCase();
					}
					
					if($(this).data('datatype') == 'date') {
						if(!rCalendar.checkValueDate($(this).val())) {
							messageError = "Неверный формат даты";
							$(this).addClass('r-calendar-field-error');
							flgCheck = false;
							return false;
						}
					}

					arrSaveItem[nameItem] = arrayTemp;
				}
			});
	
			var arrayResult = {};
			
			if(!flgCheck) {
				arrayResult[0] = false;
				arrayResult[1] = messageError;
			} else {
				arrayResult[0] = true;
				arrayResult[1] = arrSaveItem;
			}

			return arrayResult;
		},
		
		// Функция возвращения JS объекта даты
		// Принимает на вход данные в формате string даты и возвращает объект Data
		getObjectDate: function(stringDate) {
			var temp = this.getDateToNormalFormat(stringDate, false);
			var objectDate = new Date(temp.substr(6, 4), Number(temp.substr(3, 2)) - 1, temp.substr(0, 2));
			return objectDate;
		},
		
		// Функция сохранения данных на сервере
		save: function(event) {
			var rCalendar = event.data.rCalendar;
			var modalWindow = $(this).closest('.r-calendar-modal');
			
			var arrSaveItem = {};
			var resultCollectionsItems = rCalendar.saveCheckData($(this).closest('.r-calendar-modal'), rCalendar);
			if(resultCollectionsItems[0]) {
				arrSaveItem = resultCollectionsItems[1];
			} else {
				$(this).closest('.r-calendar-modal').find('.r-calendar-modal-text-error').html(resultCollectionsItems[1]);
				return;
			}
			
			// ID Reservation
			arrSaveItem["idReservation"] = String($(this).data('id'));
			
			// Action 
			arrSaveItem["action"] = (Number($(this).data('id')) == -1) ? "insert" : "update";
			rCalendar.ajaxQuery(rCalendar, modalWindow, JSON.stringify(arrSaveItem), rCalendar.ajaxStatusSuccess, rCalendar.ajaxStatusError);
		},
		
		// Функция удаления бронирования
		remove: function(event) {
			var rCalendar = event.data.rCalendar;
			var modalWindow = $(this).closest('.r-calendar-modal');

			if($(this).data('id') === undefined)
				return;
			
			var idReservation = $(this).data('id');
			var query = JSON.stringify({ "action" : "delete", "idReservation" : idReservation });
			rCalendar.ajaxQuery(rCalendar, modalWindow, query, rCalendar.ajaxStatusSuccess, rCalendar.ajaxStatusError);
		},
		
		/*
			Ajax метод сохранения информации
			rCalendar - указатель на объект, который инициировал сохранение
			modalWindow - указатель на модальное окно на котором была нажата кнопка
			data - запрос для сохранения информации
			callback - функция обратного вызова
		*/
		ajaxQuery: function(rCalendar, modalWindow, data, callbackSuccess, callbackError) {
			var url = (rCalendar.opts.handlersScript === undefined || String(rCalendar.opts.handlersScript).length == 0) ? null : rCalendar.opts.handlersScript;
			$.ajax({
				type: 'POST',
				url: url,
				data: data,
				cache: true,
				processData: true,
				contentType: 'application/x-www-form-urlencoded',
				
				success: function(data) {
					if(callbackSuccess != null)
						callbackSuccess(data, modalWindow);
				},
				
				error: function(data, status, xhr) {
					if(callbackError != null)
						callbackError(data, modalWindow);
				}
			});
		},
		
		// Обработка ответа от сервера в случае успеха
		ajaxStatusSuccess: function(data, modalWindow) {
			try {
				var result = eval(data);
				if(res[0] == 'OK') {
					$(modalWindow).remove();
					$('body').find('.r-calendar-modal-backdrop').remove();
					$('body').removeClass('r-calendar-modal-open');
				} else {
					$(modalWindow).find('.r-calendar-modal-text-error').html(res[0]);
				}
			} catch {
				if(data == 'OK') {
					$(modalWindow).remove();
					$('body').find('.r-calendar-modal-backdrop').remove();
					$('body').removeClass('r-calendar-modal-open');
				} else {
					$(modalWindow).find('.r-calendar-modal-text-error').html(res[0]);
				}
			}
		},
		
		// Обработка ответа от сервера в случае ошибки
		ajaxStatusError: function(data, modalWindow) {
			$(modalWindow).find('.r-calendar-modal-text-error').html('При обработке запроса произошла ошибка!');
		},

		// Конвертация данных в человеческий вид
		// Флаг addMonth отвечает надо ли добавлять 1 к месяцу.Так как в JS нумерация месяцев начинается с 0
		getDateToNormalFormat: function(date, addMonth) {
			var year, month, day;
			if(String(date).indexOf('-') != -1) {
				var temp = String(date).split('-');
				year = temp[0];
				month = temp[1];
				day = temp[2];
				if((new Date(year, month, day)) === undefined)
					return "00.00.0000";
			} else if(String(date).indexOf('.') != -1) {
				var temp = String(date).split('.');
				year = temp[2];
				month = temp[1];
				day = temp[0];
				if((new Date(year, month, day)) === undefined)
					return "00.00.0000";
			}

			if(addMonth === undefined || addMonth === true)
				month = Number(month) + 1;
			month = (String(month).length == 2) ? month : '0' + String(month);
			day = (String(day).length == 2) ? day : '0' + String(day);
			
			return day + '.' + month + '.' + year;
		},
		
		// Закрытие всплывающего модального окна
		closeModalWindow: function(event) {
			$(event.target).closest('.r-calendar-modal').remove();

			if($('body').find('.r-calendar-modal').length == 0) {
				$('body').find('.r-calendar-modal-backdrop').remove();
				$('body').removeClass('r-calendar-modal-open');
			}
		},
		
		// Функция отрисовывает предыдущий временной период
		prev: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			switch(rCalendar.opts.view) {
				case 'months':
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), (rCalendar.opts.startDay.getMonth() - 1), rCalendar.opts.startDay.getDate());
					break;

				case 'weeks':
					var tt = rCalendar.opts.startDay;
					do {
						tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() - 1));
					} while(rCalendar.opts.startDay.getWeek() == tt.getWeek());
					rCalendar.opts.startDay = tt;
					break;
				
				case 'days':
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), rCalendar.opts.startDay.getMonth(), (rCalendar.opts.startDay.getDate() - 1));
					break;
				
				default:
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), (rCalendar.opts.startDay.getMonth() - 1), rCalendar.opts.startDay.getDate());
					break;
			}
			rCalendar.update();
		},
		
		// Функция отрисовывает следующий временной период
		next: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			switch(rCalendar.opts.view) {
				case 'months':
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), (rCalendar.opts.startDay.getMonth() + 1), rCalendar.opts.startDay.getDate());
					break;
				
				case 'weeks':
					var tt = rCalendar.opts.startDay;
					do {
						tt = new Date(tt.getFullYear(), tt.getMonth(), (tt.getDate() + 1));
					} while(rCalendar.opts.startDay.getWeek() == tt.getWeek());
					rCalendar.opts.startDay = tt;
					break;
				
				case 'days':
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), rCalendar.opts.startDay.getMonth(), (rCalendar.opts.startDay.getDate() + 1));
					break;
				
				default:
					rCalendar.opts.startDay = new Date(rCalendar.opts.startDay.getFullYear(), (rCalendar.opts.startDay.getMonth() + 1), rCalendar.opts.startDay.getDate());
					break;
			}
			rCalendar.update();
		},
		
		// Функция отрисовывает текущую дату
		today: function() {
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			rCalendar.opts.startDay = new Date();
			rCalendar.update();
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
	
	// Массив с языками
	$.fn.rCalendar.language = {
		ru: {
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			daysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
			months: ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'],
			months2: ['ЯНВАРЯ', 'ФЕВРАЛЯ', 'МАРТА', 'АПРЕЛЯ', 'МАЯ', 'ИЮНЯ', 'ИЮЛЯ', 'АВГУСТА', 'СЕНТЯБРЯ', 'ОКТЯБРЯ', 'НОЯБРЯ', 'ДЕКАБРЯ'],
			monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			hours: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
			today: 'Сегодня',
			time: 'Время',
			month: 'Месяц',
			week: 'Неделя',
			day: 'День'
		},
		
		en: {
			days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			months: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
			months2: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
			monthsShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
			hours: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
			today: 'Today',
			time: 'Time',
			month: 'Month',
			week: 'Week',
			day: 'Day'
		}
	};
	
//});
})(jQuery);