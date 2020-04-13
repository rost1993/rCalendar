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
	<link rel='stylesheet' href='css/r-calendar.css?ver=1'>
	
	<script src='js/jquery-3.4.1.min.js'></script>
	<!--<script src='js/bootstrap.min.js'></script>
	<script src='js/bootstrap.bundle.min.js'></script>-->
	<script src='js/r-calendar.js?ver=1'></script>
</head>	
<body>
	<script>
		$(function(){
			//$('.my-calendar').rCalendar({ year : "2019", month : "11", day : "23" });
			var selectTable = '{"1" : "1-й стол", "2" : "2-й стол", "3" : "3-й стол", "4" : "4-й стол"}';
			var selectCustomer = ["1-й клиент", "2-й клиент", "3-й клиент"];
			
			var data = '[{ "id" : "1", "startDate" : "13.04.2020", "startDateHour" : "2", "startDateMinute" : "00", "endDate" : "13.04.2020", "endDateHour" : "4", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "numberTableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "1", "startDate" : "13.04.2020", "startDateHour" : "13", "startDateMinute" : "00", "endDate" : "13.04.2020", "endDateHour" : "16", "endDateMinute" : "00", "nameReservation" : "Дружеская встреча", "numberTableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "1", "startDate" : "13.04.2020", "startDateHour" : "2", "startDateMinute" : "55", "endDate" : "13.04.2020", "endDateHour" : "4", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "numberTableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"},'
					  + '{ "id" : "2", "startDate" : "15.04.2020", "startDateHour" : "2", "startDateMinute" : "00", "endDate" : "15.04.2020", "endDateHour" : "3", "endDateMinute" : "00", "nameReservation" : "1", "numberTableReservation" : "1", "customerReservation" : "123", "commentReservation" : "123"} ]';
			
			//var selectCustomer = '{"1-й клиент", "2-й клиент", "3-й клиент"}';
			
				//var data = '[{ "id" : "1", "startDate" : "13.04.2020", "startDateHour" : "2", "startDateMinute" : "55", "endDate" : "13.04.2020", "endDateHour" : "4", "endDateMinute" : "55", "nameReservation" : "Дружеская встреча", "numberTableReservation" : "2-й стол", "customerReservation" : "3-й клиент", "commentReservation" : "Комментарий"} ]';
			
			//var startDay = new Date(2020, 03, 15);
			$('.r-calendar-test-1').rCalendar({ "language" : "ru", "selectTable" : selectTable, "selectCustomer" : selectCustomer, "arrayDataEvents" : data });
			
			//$('.r-calendar-test-2').rCalendar({ "language" : "en", "handlersScript" : "123.php" });
		});
	</script>

	<div class="r-calendar r-calendar-test-1"></div>
	
	<!--<div class="r-calendar r-calendar-test-2"></div>-->
	
</body>
</html>