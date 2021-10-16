
export default ( url, method, body, no_spinner ) => {

	return new Promise( ( resolve, reject ) => {


		if( method.match(/post/i) ){

			fetch( url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( body )
			})
			.then( res => {
				res.json()
				.then( r => {
					resolve( r )
				}).catch( err => {
					reject( err )
				})
			}).catch( err => {
				reject( err )
			})

		}else if( method.match(/get/i) ){

			fetch( url )
			.then( res => {
				res.json()
				.then( r => {
					resolve( r )
				}).catch( err => {
					reject( err )
				})
			}).catch( err => {
				reject( err )
			})

		}else{

			reject('invalid fetch ' + url )
			
		}

	})


}

