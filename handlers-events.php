<?php
	$array = $_POST['JSON'];
	$array_temp = json_decode($_POST['JSON']);
	
	//$action = $array_temp['action'];
	
	$tt = '';
	foreach($array_temp as $key => $value) {
		if($key == 'nameReservation')
			$tt = $value;
	}
	
	echo json_encode(array('OK'));