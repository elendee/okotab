
const css_content = `
#alert-contain{
	position:fixed;
	z-index: 999999;
	bottom: 100px;
	right: 30px;
	text-align: right;
	width: 70%;
	pointer-events: none;
	padding-top: 10px;
}
.alert-wrap{
	transition: .5s;
}
.alert-msg{
	position: relative;
	background: rgba(0, 0, 0, .9);
	color: lightgrey;
	font-size: 13px;
	display: inline-block;
	margin: 1px 0;
	padding: 3px 40px 3px 20px;
    pointer-events: initial;
    text-align: left;
    border: 1px solid #353535;
}
.alert-msg pre{
	max-height: 80vh;
    overflow-y: auto;
}
.alert-msg span{
	color: orange
}
.alert-icon, 
.alert-close{
	height: 100%;
	width: 30px;

	display: flex;
	justify-content: center;
	align-items: center;
}

.alert-icon{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 12px;
}

.alert-close{
	position: absolute;
	right: 0px;
	top: 0px;
	pointer-events: initial;
	cursor: pointer;
	border-left: 1px solid grey;
	display: flex;
	justify-content: center;
	align-items: center;
}
.alert-close:hover{
	background: rgba(250, 50, 55, .4);
}
.alert-icon{
	background: lightgrey;
}
.success .alert-icon{
	background: rgba(100, 245, 100, .7);
}
.alert-icon.type-error,
.alert-icon.type-warning{
	background: red;
}
.hal.alert-msg{
	color: orange;
	border: 1px solid orange;
}
.hal .alert-icon{
    background: orange;
}
.combat .alert-icon{
	background: #ff8304;
}
`

const css = document.createElement('style')
css.innerHTML = css_content
document.head.appendChild( css )

const alert_contain = document.createElement('div')
alert_contain.id = 'alert-contain'
document.body.appendChild( alert_contain )


function hal( type, msg, time ){

	const alert_wrapper = document.createElement('div')
	const alert_msg = document.createElement('div')
	const close = document.createElement('div')

	if( !type ) type = 'standard'

	close.innerHTML = '&times;'
	close.classList.add('alert-close')

	let icon = '<div></div>'

	alert_msg.innerHTML = `<div class='alert-icon type-${ type }'>${ icon }</div>${ type === 'hal' ? 'SYSTEM: ' + msg : msg }`
	alert_wrapper.classList.add('ui-fader')
	alert_msg.classList.add('alert-msg', type)
	alert_msg.appendChild( close )
	alert_wrapper.appendChild( alert_msg )

	alert_contain.appendChild( alert_wrapper )

	close.onclick = function(){
		alert_wrapper.style.opacity = 0
		setTimeout(function(){
			alert_wrapper.remove()
		}, 500)
	}

	if( time ){
		setTimeout(function(){
			alert_wrapper.style.opacity = 0
			setTimeout(function(){
				alert_wrapper.remove()
			}, 500)
		}, time)
	}
	
}


export default hal




