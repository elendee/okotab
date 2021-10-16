<?php
header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] );

include_once('env.php');

$r = new stdClass;
$r->success = true;

$body = json_decode( file_get_contents('php://input'), true);

if( empty( $body['pw'] ) ){ // reject

	$r->success = false;
	$r->msg = 'no pw';

}else if( $body['pw'] !== $TODO_PW ){ // reject

	$r->success = false;
	$r->msg = 'wrong pw';

}else{ // get

	$boards = file_get_contents( $TODO_URI );

	$r->boards = $boards;

}

echo json_encode( $r );
