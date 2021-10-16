// import env from './env.js?v=1'
import hal from './hal.js?v=1'
// import fetch_wrap from './fetch_wrap.js?v=1'
import {
	// Board,
	Pad,
} from './classes.js?v=1'

const nav = document.querySelector('#boards .content')
const scratch = document.querySelector('#scratchpad')


const pad = window.pad = new Pad({
	nav: nav,
	scratchpad: scratchpad,
})

pad.get()
.then( res => {
	pad.set_active()
	// setTimeout(() => {
	// 	console.log('dev save')
	// 	pad.set()
	// }, 1000 )
})
.catch( err => {
	console.log( err )
})