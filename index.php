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
	<script src='js/bootstrap.min.js'></script>
	<script src='js/bootstrap.bundle.min.js'></script>
	<script src='js/r-calendar.js?ver=1'></script>
</head>	
<body>
	<script>
		$(function(){
			//$('.my-calendar').rCalendar({ year : "2019", month : "11", day : "23" });
			var selectTable = '{"1" : "1-й стол", "2" : "2-й стол", "3" : "3-й стол", "4" : "4-й стол"}';
			var selectCustomer = ["1-й клиент", "2-й клиент", "3-й клиент"];
			//var selectCustomer = '{"1-й клиент", "2-й клиент", "3-й клиент"}';
			$('.r-calendar').rCalendar({ "language" : "ru", "selectTable" : selectTable, "selectCustomer" : selectCustomer });
		});
	</script>

	<div class="r-calendar"></div>
	
</body>
</html>