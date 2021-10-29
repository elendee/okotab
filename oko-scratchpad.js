import env from './env.js?v=1'
import hal from './hal.js?v=1'
import * as lib from './lib.js?v=1'
import {
	Notebook,
	Page,
} from './classes.js?v=1'

const nav = document.querySelector('#boards .content')
const public_nav = document.querySelector('#boards .public-boards')
const scratch = document.querySelector('#scratchpad')


const notebook = window.notebook = new Notebook({
	nav: nav,
	public_nav: public_nav,
	scratchpad: scratchpad,
})


;(async() => {


	// INIT PRIVATE
	const pages = await notebook.get('private')

	// INIT PUBLIC
	for( const set of env.PUBLIC || [] ){
		const url = set.URL
		notebook.get( 'public', set )
		.then( pages => {
			
			const data = pages || {}

			const page = new Page({
				// data things
				name: data.name || lib.random_hex( 6 ),
				content: data.content || '(empty public page eyo)',
				url: set.URL,
				// local things
				nav: public_nav,
				notebook: notebook,
			})
			page.initialize()

			notebook.set_active( null )

		})
	}

})();


window.addEventListener('focus', e => {
	notebook.ctrlPressed = false
})
window.addEventListener('blur', e => {
	notebook.ctrlPressed = false
})
	
