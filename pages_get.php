<?php
header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] );

include_once('env.php');
// include_once('oko_LOG.php');

$r = new stdClass;
$r->success = true;

$body = json_decode( file_get_contents('php://input'), true);

if( empty( $body['pw'] ) ){ // reject

	$r->success = false;
	$r->msg = 'no pw';

}else{

	// if( $body['type'] != 'private' && $body['type'] != 'public' ){

	// 	$r->success = false;
	// 	$r->msg = 'invlalid page type';

	// }else{

	// 	if( $body['type'] == 'private' ){

	// 		$pw = $TODO_PW

	// 	}else{

	// 		$pw = 

	// 	}

	if( $body['pw'] !== $TODO_PW ){ // reject

		$r->success = false;
		$r->msg = 'wrong pw';

	}else{ // get

		// oko_LOG('attempting: ' . $TODO_PW . ' ' . $TODO_URI );

		$pages = file_get_contents( $TODO_URI );

		$r->pages = $pages;

	}

	// }

}

echo json_encode( $r );
