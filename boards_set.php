<?php
header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] );

include_once( 'env.php' );

$r = new stdClass;
$r->success = true;

$body = json_decode( file_get_contents('php://input'), true);

if( empty( $body['pw'] ) ){ // reject

	$r->success = false;
	$r->msg = 'no pw';

}else if( $body['pw'] !== $TODO_PW ){ // reject

	$r->success = false;
	$r->msg = 'wrong pw';

}else{ // save

	$boards = file_get_contents( $TODO_URI );

	if( empty( $boards ) ){

		$boards = new stdClass;
		$boards->private1 = '';
		$boards->private2 = '';
		$boards->private3 = '';
		$boards->public1 = '';
		$boards->public2 = '';
		$boards->public3 = '';

	}else{

		$boards = json_decode( $body['boards'] );

	}

	file_put_contents( $TODO_URI, json_encode( $boards ) );

}


echo json_encode( $r );
