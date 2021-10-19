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

}else if( $body['pw'] !== $TODO_PW ){ // reject

	$r->success = false;
	$r->msg = 'wrong pw';

}else{ // save

	$persist_data = file_get_contents( $TODO_URI );

	if( $body['private'] ){

		if( empty( $persist_data ) ){

			$persist_data = new stdClass;
			$persist_data->private1 = '';
			$persist_data->private2 = '';
			$persist_data->private3 = '';
			// $persist_data->public1 = '';
			// $persist_data->public2 = '';
			// $persist_data->public3 = '';

		}else{

			$persist_data = json_decode( $body['pages'] );

		}

		file_put_contents( $TODO_URI, json_encode( $persist_data ) );

	}else{

		if( empty( $persist_data ) ){

			$persist_data = new stdClass;

		}else{

			$obj = json_decode( $persist_data );
			// oko_LOG( $obj );
			if( gettype( $obj ) !== 'object' ){
				$obj = new stdClass;
			}

			$obj->name = substr( $body['name'], 0, 6 );
			$obj->content = $body['content'];

		}

		file_put_contents( $TODO_URI, json_encode( $obj ) );
		// oko_LOG('trying to write : ' . $body['name'] . ' + ' . $body['content' ] );

	}


}


echo json_encode( $r );
