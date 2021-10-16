import spinner from './spinner.js?v=1'

export default ( url, method, body, no_spinner ) => {

	return new Promise( ( resolve, reject ) => {

		spinner.show()

		if( method.match(/post/i) ){

			fetch( url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( body )
			})
			.then( res => {
				spinner.hide()
				res.json()
				.then( r => {
					resolve( r )
				}).catch( err => {
					reject( err )
				})
			}).catch( err => {
				spinner.hide()
				reject( err )
			})

		}else if( method.match(/get/i) ){

			fetch( url )
			.then( res => {
				spinner.hide()
				res.json()
				.then( r => {
					resolve( r )
				}).catch( err => {
					reject( err )
				})
			}).catch( err => {
				spinner.hide()
				reject( err )
			})

		}else{

			spinner.hide()
			reject('invalid fetch ' + url )
			
		}

	})


}

