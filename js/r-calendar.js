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
			selectTable: '',
			selectCustomer: []
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
				"<div class='r-calendar-day " + daysRCalendar[i][1]['class'] + "' data-date='" + daysRCalendar[i][1]['date'] + "'><span class='r-calendar-text-day'>" + daysRCalendar[i][1]['value'] + "</span></div>" +
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
			this.$el.find('.r-calendar-day-active,.r-calendar-daytime-active').on('click', this.showModalWindow);
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
			if(event.target.tagName == 'SPAN' && event.target.className == 'r-calendar-text-day'){
				var split_date = $(this).closest('.r-calendar-day').data('date').split('-');
				var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
				rCalendar.opts.startDay = new Date(split_date[0], split_date[1], split_date[2]);
				rCalendar.opts.view = 'days';
				rCalendar.update();
				return;
			}

			// Устанавливаем событие для закрытия окошка
			var rCalendar = $(this).closest('.r-calendar').data('rCalendar');
			var selectTableList, selectCustomerList;
			
			// Получаем выбранную дату
			var selectedDate = rCalendar.getDateToNormalFormat($(this).data('date'));
			
			var selectedHour, selectedMinute;
			
			if(rCalendar.opts.view == 'weeks') {
				var temp = $(this).closest('.r-calendar-week').find('.r-calendar-week-grid-10').data('time');
				var tempSplit = (temp === undefined) ? '00:00'.split(':') : temp.split(':');
				selectedHour = (tempSplit.length > 1) ? tempSplit[0] : '00';
				selectedMinute = (tempSplit.length > 1) ? tempSplit[1] : '00';
			} else if(rCalendar.opts.view == 'days') {
				var temp = $(this).closest('.r-calendar-daytime').find('.r-calendar-daytime-grid-10').data('time');
				var tempSplit = (temp === undefined) ? '00:00'.split(':') : temp.split(':');
				selectedHour = (tempSplit.length > 1) ? tempSplit[0] : '00';
				selectedMinute = (tempSplit.length > 1) ? tempSplit[1] : '00';
			} else {
				selectedHour = selectedMinute = '00';
			}

			// Разбираем список столов
			try {
				var temp = JSON.parse(rCalendar.opts.selectTable);
				selectTableList = "<option value='0'></option>";
				for(var key in temp)
					selectTableList += "<option value='" + key + "'>" + temp[key] + "</option>";
			} catch{
				selectTableList = "<option value=''></option>";
				if(typeof(rCalendar.opts.selectTable) === 'object') {
					var temp = eval(rCalendar.opts.selectTable);
					for(var i = 0; i < temp.length; i++)
						selectTableList += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
				}
			}
			
			// Разбираем список клиентов
			try {
				var temp = JSON.parse(rCalendar.opts.selectCustomer);
				selectCustomerList = "<option value='0'></option>";
				for(var key in temp)
					selectCustomerList += "<option value='" + key + "'>" + temp[key] + "</option>";
			} catch {
				selectCustomerList = "<option value=''></option>"
				if(typeof(rCalendar.opts.selectCustomer) === 'object') {
					var temp = eval(rCalendar.opts.selectCustomer);
					for(var i = 0; i < temp.length; i++)
						selectCustomerList += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
				}
			}
			
			var modal = $("<div class='r-calendar-modal r-calendar-modal-show'>"
			+ "<div class='r-calendar-modal-dialog r-calendar-modal-dialog-centered'>"
				+ "<div class='r-calendar-modal-content'>"
					+ "<div class='r-calendar-modal-header'><div class='r-calendar-modal-title'>Бронирование стола</div><button class='r-calendar-close'>&times;</button></div>"
					+ "<div class='r-calendar-modal-body'>"
					
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Начало бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='' maxlength='10' style='width: 20%;' placeholder='ДД.ММ.ГГГГ' value='" + selectedDate + "'>"
								+ "<span class='r-calendar-input-group-text'>ч.</span>"
								+ "<input type='number' class='r-calendar-form-control' id='startDateHour' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='23' step='1' value='" + selectedHour + "'>"
								+ "<span class='r-calendar-input-group-text'>м.</span>"
							+ "<input type='number' class='r-calendar-form-control' id='startDateMinute' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='59' step='1' value='" + selectedMinute + "'>"
						+ "</div>"
						
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Окончание бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='' maxlength='10' style='width: 20%;' placeholder='ДД.ММ.ГГГГ' value='" + selectedDate + "'>"
								+ "<span class='r-calendar-input-group-text'>ч.</span>"
								+ "<input type='number' class='r-calendar-form-control' id='endDateHour' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='23' step='1' value='" + selectedHour + "'>"
								+ "<span class='r-calendar-input-group-text'>м.</span>"
							+ "<input type='number' class='r-calendar-form-control' id='endDateMinute' maxlength='2' placeholder='00' style='width: 10%;' min='0' max='59' step='1' value='" + selectedMinute + "'>"
						+ "</div>"
					
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Название бронирования</label>"
							+ "<input type='text' class='r-calendar-form-control' id='nameReservation'>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Номер стола</label>"
							+ "<select type='text' class='r-calendar-form-control' id='numberTableReservation'>" + selectTableList + "</select>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Клиенты</label>"
							+ "<select type='text' class='r-calendar-form-control' id='customerReservation'>" + selectCustomerList + "</select>"
						+ "</div>"
						+ "<div class='r-calendar-form-row'>"
							+ "<label class='r-calendar-label-form'>Комментарий</label>"
							+ "<textarea class='r-calendar-form-control' rows='3' id='commentReservation'></textarea>"
						+ "</div>"
					+ "</div>"
					+ "<div class='r-calendar-modal-footer'><button class='btn btn-success'>Сохранить</button></div>"
				+ "</div>"
			+ "</div>"
			+ "</div>");
			
			var modal_backdrop = $("<div class='r-calendar-modal-backdrop'></div>");
			
			$('body').append(modal);
			$('body').append(modal_backdrop);
			$('body').addClass('r-calendar-modal-open');

			$('body').find('.r-calendar-close').unbind();
			$('body').find('.r-calendar-close').on('click', rCalendar.closeModalWindow);

			$('body').find('.r-calendar-modal').unbind();
			$('body').find('.r-calendar-modal').find("[type='number']").on('input', rCalendar.checkValueTime);
		},
		
		// Функция проверки ввода времени на корректность
		checkValueTime: function() {
			var x = (/\d+/i.exec($(this).val()) === null) ? 0 : String(/\d+/i.exec($(this).val())).substr(0, 2);
			if(x == 0)
				$(this).val($(this).val().substr(0, 2));
			else
				$(this).val((Number(x) > Number($(this).prop('max'))) ? $(this).prop('max'): (x == 0) ? '' : x);
		},
		
		// Конвертация данных в человеческий вид
		getDateToNormalFormat: function(date) {
			var temp = String(date).split('-');
			var year = temp[0];
			var month = temp[1];
			var day = temp[2];
			if((new Date(year, month, day)) === undefined)
				return "00.00.0000";
			
			month = Number(month) + 1;
			month = (String(month).length == 2) ? month : '0' + String(month);
			day = (String(day).length == 2) ? day : '0' + String(day);
			
			return day + '.' + month + '.' + year;
		},
		
		// Закрытие всплывающего модального окна
		closeModalWindow: function() {
			$('body').find('.r-calendar-modal').remove();
			$('body').find('.r-calendar-modal-backdrop').remove();
			$('body').removeClass('r-calendar-modal-open');
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