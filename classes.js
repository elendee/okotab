import env from './env.js?v=1'
import hal from './hal.js?v=1'
import fetch_wrap from './fetch_wrap.js?v=1'


const default_boards = {
	private1: 'private1 board...',
	private2: 'private2 board...',
	private3: 'private3 board...',
	// public1: 'public1 board...',
	// public2: 'public2 board...',
	// public3: 'public3 board...',
}



class Board {

	constructor( init ){
		init = init || {}
		let key
		this.key = key = init.key
		this.nav = init.nav 
		this.pad = init.pad // obj
		// DOM scratchpad = this.pad.scratchpad
		this.tab = document.createElement('div')
		this.tab.innerHTML = this.key
		this.tab.classList.add('button')
		this.tab.setAttribute('data-key', key )
		this.tab.addEventListener('click', () => {
			init.pad.set_active( key )
			localStorage.setItem('oko-active-tab', key )
		})
	}

	initialize(){
		this.nav.appendChild( this.tab )
	}

}






class Pad {

	constructor( init ){
		init = init || {}
		const pad = this
		pad.nav = init.nav
		pad.scratchpad = init.scratchpad
		// bind scratchpad
		pad.ctrlPressed = false
		pad.scratchpad.addEventListener('keydown', e => {
			if( e.keyCode === 17 ) pad.ctrlPressed = true
		})
		pad.scratchpad.addEventListener('keyup', e => {
			if( e.keyCode === 17 ){
				pad.ctrlPressed = false
			}else if( e.keyCode === 13 ){
				if( pad.ctrlPressed ){
					pad.set()
					.then( res => {
						if( res ){
							hal('success', 'saved boards', 3 * 1000 )
						}else{
							hal('error', res ? ( res.msg || 'error saving board' ) : 'error', 5 * 1000 )
						}
					})
					.catch( err => { console.log( err )})
				}
			}
		})
		// init board tabs
		pad.boards = {}
		let key
		for( let i = 0; i < 3; i++ ){
			key = 'private' + ( i + 1 )
			// if( i < 3 ){
			// 	key = 'private' + ( i + 1 )
			// }else{
			// 	key = 'public' + ( i - 2 )
			// }
			if( i === 3 ) init.nav.appendChild( document.createElement('br'))
			const b = new Board({
				key: key,
				nav: init.nav,
				pad: pad,
			})
			pad.boards[ key ] = b
			b.initialize()
		}
		pad.active_key = 'private1'
	}

	async get(){

		const r = await fetch_wrap( env.SCRIPT_ROOT_URL + '/boards_get.php', 'post', {
			pw: env.PW,
		})
		if( !r || !r.success ){
			hal('error', 'error getting boards', 10 * 1000 )
			return
		}

		console.log( 'get: ', r )

		let boards
		try{
			boards = JSON.parse( r.boards )
		}catch( e ){
			console.log( e )
			boards = default_boards
			hal('error', 'resetting default_boards', 10 * 1000 )
		}

		if( !boards ){
			console.log('setting default_boards')
			boards = default_boards
		}

		if( !this.is_valid_boards( boards ) ){
			console.log( 'invalid boards: ', boards )
			hal('error', 'invalid boards found, check console for data, rendering default', 20 * 1000 )
			boards = default_boards
		}

		this.boards = boards

		return r

	}

	async set(){

		this.boards[ this.active_key ] = this.scratchpad.value

		if( this.boards[ this.active_key ] === '' ){
			this.scratchpad.value = '(empty)'
			this.boards[ this.active_key ] = this.scratchpad.value
		}

		if( !this.boards[ this.active_key ]){
			console.log( 'invalid board for save: ', this.active_key )
			return
		}

		// console.log('saving: ', this.boards )

		const r = await fetch_wrap( env.SCRIPT_ROOT_URL + '/boards_set.php', 'post', {
			pw: env.PW,
			boards: JSON.stringify( this.boards ),
		})
		if( !r || !r.success ){
			hal('error', 'error setting boards', 10 * 1000 )
			return
		}

		return true
	}

	set_active( key ){
		let content
		if( !key ) key = localStorage.getItem('oko-active-tab')
		if( !key ) key = 'private1'
		// scratchpad
		content = this.boards[ key ]
		this.scratchpad.value = content
		// tabs
		for( const tab of this.nav.querySelectorAll('.button') ){
			tab.classList.remove('active')
		}
		const active = this.nav.querySelector('.button[data-key=' + key + ']')
		active.classList.add('active')

		this.active_key = key
		//
		console.log( 'set active: ', key )
	}

	is_valid_boards( obj ){
		if( !obj ) return false
		const keys = ['public1', 'public2', 'public3', 'private1', 'private2', 'private3']
		for( const key of keys ){
			if( !Object.keys( obj ).includes( key ) ) return false
		}
		return true
	}

}

export {
	Board,
	Pad,
}