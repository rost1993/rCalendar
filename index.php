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
	<script src='js/r-calendar.js'></script>
</head>	
<body>
	<script>
		$(function(){
			$('.r-calendar').myCalendar();
		});
	</script>
	
	<!--<div><label class="myCalendar">Hello world!</label></div>-->
	
	<div class="r-calendar">

		<div class="r-calendar-toolbar">
			<div class="r-calendar-toolbar-right r-calendar-group-btn">
				<div class="btn-group" role="group" aria-label="example">
					<button class="btn btn-sm r-calendar-btn" type="button"><</button>
					<button class="btn btn-sm r-calendar-btn" type="button">></button>
				</div>
				<button class="btn btn-sm r-calendar-btn" type="button">Сегодня</button>
			</div>
			
			<div class="r-calendar-toolbar-center">
				<span class="r-calendar-toolbar-current-day"></span>
			</div>
			
			<div class="r-calendar-toolbar-left r-calendar-group-btn">
				<div class="btn-group" role="group" aria-label="example">
					<button class="btn btn-sm r-calendar-btn" type="button">Месяц</button>
					<button class="btn btn-sm r-calendar-btn" type="button">Неделя</button>
					<button class="btn btn-sm r-calendar-btn" type="button">День</button>
					<button class="btn btn-sm r-calendar-btn" type="button">Повестка дня</button>
				</div>
			</div>
		</div>
		
		<div class="r-calendar-widget">
			
			<table class="table table-bordered text-center">
				<thead>
					<tr>
						<th style="width:50px;">#</th>
						<th>пн</th>
						<th>вт</th>
						<th>ср</th>
						<th>чт</th>
						<th>пт</th>
						<th>сб</th>
						<th>вс</th>
					</tr>
				</thead>
				
				<tbody>
					<tr class="r-calendar-week-1">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>

					<tr class="r-calendar-week-2">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>
					
					<tr class="r-calendar-week-3">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>
					
					<tr class="r-calendar-week-4">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>
					
					<tr class="r-calendar-week-5">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>
					
					<tr class="r-calendar-week-6">
						<td class="number-week"></td>
						<td class="r-calendar-disable-day monday"></td>
						<td class="r-calendar-disable-day tuesday"></td>
						<td class="r-calendar-disable-day wednesday"></td>
						<td class="r-calendar-disable-day thursday"></td>
						<td class="r-calendar-disable-day friday"></td>
						<td class="r-calendar-disable-day saturday"></td>
						<td class="r-calendar-disable-day sunday"></td>
					</tr>

				</tbody>
			</table>
			
		</div>
	
	</div>
	
</body>
</html>