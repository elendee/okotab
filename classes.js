import env from './env.js?v=1'
import hal from './hal.js?v=1'
import fetch_wrap from './fetch_wrap.js?v=1'


const default_pages = {
	private1: 'private1 page...',
	private2: 'private2 page...',
	private3: 'private3 page...',
}



class Page {

	constructor( init ){
		init = init || {}
		const page = this
		let name
		page.name = name = String( init.name )
		page.nav = init.nav 
		page.private = init.private
		page.notebook = init.notebook // obj
		// DOM scratchpad = page.pad.scratchpad
		page.tab = document.createElement('div')
		page.tab.innerHTML = page.name
		page.tab.classList.add('button')
		page.tab.setAttribute('data-name', name )
		page.tab.addEventListener('click', () => {
			init.notebook.set_active( name, page.private )
			localStorage.setItem('oko-active-tab', name )
		})
		this.url = init.url
		this.content = init.content
	}

	initialize(){
		if( !this.name ){
			console.log('inavlid page', this )
			return
		}
		this.nav.appendChild( this.tab )
		let group
		if( this.private ){
			this.tab.classList.add('private')
			group = this.notebook.pages
		}else{
			group = this.notebook.public_pages
		}
		group[ this.name ] = this
	}

}





class Notebook {

	constructor( init ){

		init = init || {}

		const notebook = this
		notebook.nav = init.nav
		notebook.public_nav = init.public_nav
		notebook.scratchpad = init.scratchpad
		// bind scratchpad
		notebook.ctrlPressed = false
		notebook.scratchpad.addEventListener('keydown', e => {
			if( e.keyCode === 17 ) notebook.ctrlPressed = true
		})
		notebook.scratchpad.addEventListener('keyup', e => {
			if( e.keyCode === 17 ){
				notebook.ctrlPressed = false
			}else if( e.keyCode === 13 ){
				if( notebook.ctrlPressed ){
					notebook.set()
					.then( res => {
						if( res ){
							hal('success', 'saved pages', 3 * 1000 )
						}else{
							hal('error', res ? ( res.msg || 'error saving page' ) : 'error', 5 * 1000 )
						}
					})
					.catch( err => { console.log( err )})
				}
			}
		})
		// init page tabs
		notebook.public_pages = {}
		notebook.pages = {}
		let name
		for( let i = 0; i < 3; i++ ){
			name = 'private' + ( i + 1 )
			if( i === 3 ) init.nav.appendChild( document.createElement('br'))
			const b = new Page({
				name: name,
				nav: init.nav,
				notebook: notebook,
				private: true,
			})
			b.initialize()
		}
		notebook.active_name = 'private1'

	}





	async get( type, set ){

		console.log('get(' + type + ')')

		let url, pw

		if( type  === 'private' ){
			url = env.PRIVATE.URL
			pw = env.PRIVATE.PW
		}else if( type === 'public' ){
			url = set.URL
			pw = set.PW
		}else{
			console.log('invalid get', type, set )
			return
		}

		let r = await fetch_wrap( url + '/pages_get.php', 'post', {
			pw: pw,
		})
		if( !r || !r.success ){
			console.log( r )
			hal('error', 'error getting pages', 10 * 1000 )
			// return
			r = {}
		}

		if( r.pages === '' ) r.pages = '{}'

		let b
		try{

			b = JSON.parse( r.pages )

		}catch( e ){

			if( type === 'private' ){
				b = default_pages
				hal('error', 'resetting default_pages', 10 * 1000 )
			}else{
				// b = new Page({
				// 	name: 'xyzzy',
				// })
			}

			console.log( 'err pages: ', r )
			console.log( e )

		}

		if( type === 'private' ){
			this.pages = b || default_pages
		}
		return b

	}


	get_public_set( name ){

		let page
		for( const k in this.public_pages ){
			page = this.public_pages[ k ]
			if( page.name == name ){
				for( const set of env.PUBLIC || [] ){
					if( set.URL === page.url ) return set
				}
			}
		}
		return false

	}



	async set(){ // private or public

		console.log('set')

		const notebook = this

		let pw, url

		const public_set = notebook.get_public_set( notebook.active_name )

		if( !public_set ){ // private sets

			notebook.pages[ notebook.active_name ] = notebook.scratchpad.value

			if( notebook.pages[ notebook.active_name ] === '' ){
				notebook.scratchpad.value = '(empty)'
				notebook.pages[ notebook.active_name ] = notebook.scratchpad.value
			}

			if( !notebook.pages[ notebook.active_name ]){
				console.log( 'invalid page for save: ', notebook.active_name )
				return
			}

			pw = env.PRIVATE.PW
			url = env.PRIVATE.URL

		}else{ // public sets

			if( notebook.public_pages[ notebook.active_name ].content === '' ){
				notebook.scratchpad.value = notebook.public_pages[ notebook.active_name ].content = '(empty public page)'
			}

			if( !notebook.public_pages[ notebook.active_name ] ){
				console.log('invalid active public', notebook.active_name )
				return
			}

			// if( !set ){
			// 	console.log('could not find public page for set', notebook.active_name )
			// 	return
			// }

			pw = public_set.PW
			url = public_set.URL

		}

		const post = {
			pw: pw,
			pages: public_set ? undefined : JSON.stringify( notebook.pages ),
			name: public_set ? notebook.active_name : undefined,
			content: public_set ? notebook.scratchpad.value : undefined,
			private: !public_set,
		}

		// console.log('sending: ', post )

		const r = await fetch_wrap( url + '/pages_set.php', 'post', post )

		if( !r || !r.success ){
			hal('error', 'error setting pages', 10 * 1000 )
			return
		}

		return true

	}






	set_active( name, is_private ){ // private or public

		console.log('set_active', name )

		const ls = localStorage.getItem('oko-active-tab')

		let content
		if( !name ){
			if( ls && ls.match(/^private[1-3]/) ){
				name = ls
			}else{
				const public_tab = this.public_nav.querySelector('.button[data-name="' + ls + '"]' )
				if( public_tab ){ // usually this fires before fetch returns
					name = ls
				}else{
					name = 'private1'
				}
			}
		}

		const still_private = name.match(/^private[1-3]/)

		// scratchpad
		if( still_private ){
			content = this.pages[ name ]
		}else{
			// console.log( '>>>', this.public_pages, name )
			content = this.public_pages[ name ].content
		}
		this.scratchpad.value = content

		// tabs
		const nav = still_private ? this.nav : this.public_nav
		for( const tab of this.nav.querySelectorAll('.button') ) tab.classList.remove('active')
		for( const tab of this.public_nav.querySelectorAll('.button') ) tab.classList.remove('active')
		
		const active = nav.querySelector('.button[data-name="' + name + '"]')
		if( !active ){
			console.log('could not set active: ', nav, name )
		}else{
			active.classList.add('active')
		}

		this.active_name = name

	}



}




export {
	Page,
	Notebook,
}