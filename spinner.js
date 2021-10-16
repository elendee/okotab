let spinning = false

class Spinner{

	constructor( init ){
		init = init || {}
		this.ele = init.ele || document.createElement('div')
		this.ele.classList.add('spinner')
		this.img = init.img || document.createElement('img')
		this.img.src = this.img.src || init.src
		this.ele.appendChild( this.img )

		document.body.appendChild( this.ele )
	}

	show( ele ){
		if( ele ){
			ele.appendChild( this.ele )
		}else{
			document.body.appendChild( this.ele )
		}
		if( spinning ){
			clearTimeout(spinning)
			spinning = false
		}
		spinning = setTimeout(()=>{
			clearTimeout(spinning)
			spinning = false
			this.hide()
		}, 10 * 1000)
	}
	hide(){
		this.ele.remove()
	}
}


const spinner = new Spinner({
	src: 'spinner.gif'
})


spinner.hide()

const hide_spinner =() => {
	spinner.hide()
}

const css = `
.spinner{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99;
	transition: .3s;
	background: rgba(0, 0, 0, .2);

}
.spinner>img{
	width: 50px;
	max-width: 90% !important;
}`

const spinner_css = document.createElement('style')
spinner_css.innerHTML = css
document.body.appendChild( spinner_css )

export default spinner


