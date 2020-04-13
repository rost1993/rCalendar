<?php
	$array = $_POST['JSON'];
	$array_temp = json_decode($_POST['JSON']);
	
	//$action = $array_temp['action'];
	
	/*$tt = '';
	foreach($array_temp as $key => $value) {
		if($key == 'nameReservation')
			$tt = $value;
	}*/
	
	
	$array1 = array(array("id" => "100",
					"startDate" => "13.04.2020",
					"startDateHour" => "2",
					"startDateMinute" => "00",
					"endDate" => "13.04.2020",
					"endDateHour" => "4",
					"endDateMinute" => "55",
					"nameReservation" => "Дружеская встреча 1",
					"numberTableReservation" => "2-й стол",
					"customerReservation" => "3-й клиент",
					"commentReservation" => "Комментарий"),
					array("id" => "200",
					"startDate" => "15.04.2020",
					"startDateHour" => "2",
					"startDateMinute" => "00",
					"endDate" => "15.04.2020",
					"endDateHour" => "3",
					"endDateMinute" => "00",
					"nameReservation" => "Дружеская встреча 2",
					"numberTableReservation" => "2-й стол",
					"customerReservation" => "3-й клиент",
					"commentReservation" => "Комментарий"));
	
	sleep(1);
	echo json_encode(array('OK', json_encode($array1)));