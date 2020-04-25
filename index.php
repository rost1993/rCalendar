<?php

?>

<!DOCTYPE HTML>
<html lang='en'>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=UTF-8;'>
	<meta charset='UTF-8'>
	<meta http-equiv='X-UA-Compatible' content='IE=edge'>
	<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>

	<link rel='stylesheet' href='css/bootstrap.min.css'>
	<link rel='stylesheet' href='css/datepicker.css'>
	<link rel='stylesheet' href='css/r-calendar.css?ver=1'>
	
	<script src='js/jquery-3.4.1.min.js'></script>
	<!--<script src='js/bootstrap.min.js'></script>
	<script src='js/bootstrap.bundle.min.js'></script>-->
	<script src='js/bootstrap-datepicker.js'></script>
	<script src='js/r-calendar.js?ver=1'></script>
</head>	
<body>
	<script>
		$(function(){
			var selectTable = '{"1" : "1-й стол", "2" : "2-й стол", "3" : "3-й стол", "4" : "4-й стол"}';
			var selectCustomer = ["1-й клиент", "2-й клиент", "3-й клиент"];
			
			var data = '[{ "id" : "1", "startDate" : "23.04.2020", "startDateHour" : "2", "startDateMinute" : "00", "endDate" : "23.04.2020", "endDateHour" : "4", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "2", "startDate" : "23.04.2020", "startDateHour" : "13", "startDateMinute" : "00", "endDate" : "23.04.2020", "endDateHour" : "16", "endDateMinute" : "10", "nameReservation" : "Дружеская встреча", "numberTableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "3", "startDate" : "23.04.2020", "startDateHour" : "16", "startDateMinute" : "30", "endDate" : "23.04.2020", "endDateHour" : "17", "endDateMinute" : "00", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "3", "startDate" : "23.04.2020", "startDateHour" : "12", "startDateMinute" : "30", "endDate" : "23.04.2020", "endDateHour" : "17", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "3", "startDate" : "23.04.2020", "startDateHour" : "12", "startDateMinute" : "21", "endDate" : "23.04.2020", "endDateHour" : "16", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "3", "startDate" : "23.04.2020", "startDateHour" : "13", "startDateMinute" : "30", "endDate" : "23.04.2020", "endDateHour" : "15", "endDateMinute" : "00", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "4", "startDate" : "15.04.2020", "startDateHour" : "2", "startDateMinute" : "00", "endDate" : "15.04.2020", "endDateHour" : "3", "endDateMinute" : "00", "nameReservation" : "1", "tableReservation" : "1", "customerReservation" : "123", "commentReservation" : "123"},'
					  + '{ "id" : "3", "startDate" : "23.04.2020", "startDateHour" : "13", "startDateMinute" : "30", "endDate" : "23.04.2020", "endDateHour" : "15", "endDateMinute" : "00", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "3", "startDate" : "13.04.2020", "startDateHour" : "20", "startDateMinute" : "35", "endDate" : "13.04.2020", "endDateHour" : "21", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "tableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"}]';

			var startDay = new Date(2020, 03, 23);
			$('.r-calendar-test-1').rCalendar({ "startDay" : startDay, "view" : "weeks", "language" : "ru", "selectTable" : selectTable, "selectCustomer" : selectCustomer, "arrayDataEvents" : data });
		});
	</script>

	<div class="r-calendar r-calendar-test-1"></div>

</body>
</html>