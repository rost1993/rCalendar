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
	<link rel='stylesheet' href='css/r-calendar.css'>
	
	<script src='js/jquery-3.4.1.min.js'></script>
	<script src='js/bootstrap.min.js'></script>
	<script src='js/bootstrap.bundle.min.js'></script>
	<script src='js/r-calendar-temp-2.js'></script>
</head>	
<body>
	<script>
		$(function(){
			//$('.my-calendar').rCalendar({ year : "2019", month : "11", day : "23" });
			$('.r-calendar').rCalendar({ "language" : "ru", "view" : "weeks" });
		});
	</script>

	<div class="r-calendar"></div>
	
</body>
</html>