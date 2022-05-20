let windowIndex = 0;

const floatingWindowConfig = {
	window: {
		borderRadius: 5,
		outlineColor: "#BBB",
		x: 50,
		y: 50
	},
	taskBar: {
		color: "#BBB",
		height: 35
	}
}

class FloatingWindow {
	constructor(params) {
		var width = (params.width ? params.width : 600)
		var height = (params.height ? params.height : 400)
		var content = (params.content ? params.content : "")
		var title = (params.title ? params.title : "")
		this.window = document.createElement('div');
		this.window.classList.add('mw')
		this.window.style.top = increaseXPosition()
		this.window.style.left = increaseYPosition()
		this.window.style.zIndex = increaseZIndex();
		this.window.style.width = width + "px";
		this.window.style.height = height + "px";
		this.window.style.borderRadius = floatingWindowConfig.window.borderRadius + "px";
		this.window.style.outline = "1px solid " + floatingWindowConfig.window.outlineColor;
		this.window.onmousemove = function() {
			if (event.buttons === 1 && this.getAttribute('held') === 'true') {
				this.style.left = adjustPxString(this.style.left,event.movementX);
				this.style.top  = adjustPxString(this.style.top, event.movementY);
				if (this.classList.contains('maximized') || this.classList.contains('fixedtoleft') || this.classList.contains('fixedtoright')) {
					this.classList.remove('maximized');
					this.classList.remove('fixedtoleft');
					this.classList.remove('fixedtoright');
					this.style.left = event.clientX - this.style.width.replace("px","") / 2 + "px";
					this.style.top = event.clientY - 10 / 2 + "px";
				}
				if (event.clientX === 0) {
					this.classList.add('fixedtoleft');
				} else {
					this.classList.remove('fixedtoleft');
				}
				if (event.clientX >= window.innerWidth) {
					this.classList.add('fixedtoright');
				} else {
					this.classList.remove('fixedtoright');
				}
				if (event.clientY <= 0) {
					this.classList.add('maximized');
				} else {
					this.classList.remove('maximized');
				}
			}
		}
		this.window.onmouseup = function() {
			this.setAttribute('held', 'false')
		}
		document.body.appendChild(this.window);


		this.windowTaskbar = document.createElement('div');
		this.windowTaskbar.classList.add('taskbar')
		var tb = floatingWindowConfig.taskBar;
		this.windowTaskbar.onmousedown = function() {
			this.parentElement.setAttribute('held', 'true')
			this.parentElement.style.zIndex = increaseZIndex();
		}
		this.windowTaskbar.style.backgroundColor = floatingWindowConfig.taskBar.color;
		this.windowTaskbar.style.height = floatingWindowConfig.taskBar.height + "px";
		this.window.appendChild(this.windowTaskbar);

		var oppositecolor = (lightOrDark(floatingWindowConfig.taskBar.color) ? "black" : "white")
		this.windowTitle = document.createElement('p');
		this.windowTitle.innerHTML = title;
		this.windowTitle.classList.add('title');
		this.windowTitle.style.fontSize = floatingWindowConfig.taskBar.height - 15 + "px"
		this.windowTitle.style.color = oppositecolor;
		this.windowTaskbar.appendChild(this.windowTitle)

		this.windowActions = document.createElement('div')
		this.windowActions.classList.add('actions')
		this.windowActions.style.right = 0;
		this.windowActions.style.position = "absolute";
		this.windowActions.style.height = floatingWindowConfig.taskBar.height + "px";
		var padding = floatingWindowConfig.taskBar.height / 2 - 10 + "px"
		this.windowActions.innerHTML = `
			<div class="action"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<path d="M20,10 30,10" fill="none" stroke="${oppositecolor}" stroke-linecap="round" stroke-width="2"></path>
				</svg>
			</div>
			<div class="action" onclick="maximizeWindow(this.parentElement.parentElement.parentElement);"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<path d="M23,6 23,4 33,4 33,12 31,12 M20,7 30,7 30,15 20,15 20,7 25,7" fill="none" stroke="${oppositecolor}" stroke-linejoin="round" stroke-width="2"></path>
				</svg>
			</div>
			<div class="action" onclick="this.parentElement.parentElement.parentElement.remove()"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<path d="M20,5 30,15 M30,5 20,15 25" fill="none" stroke="${oppositecolor}" stroke-linecap="round" stroke-width="2"></path>
				</svg>
			</div>
		`
		this.windowTaskbar.appendChild(this.windowActions)

		this.windowContent = document.createElement('div');
		this.windowContent.classList.add('contents')
		this.windowContent.style.height = height - floatingWindowConfig.taskBar.height + "px"
		this.windowContent.style.width = width + "px";
		this.windowContent.style.position = "absolute"
		this.windowContent.style.top =  floatingWindowConfig.taskBar.height;
		this.windowContent.style.backgroundColor = "white";
		this.windowContent.innerHTML += content
		this.window.appendChild(this.windowContent);
	}
}

function adjustPxString(string, mod) {
	return parseInt(string.replace("px","")) + mod + "px";
}

function maximizeWindow(elem) {
	if (elem.classList.contains('fixedtoright')) {
		elem.classList.remove('fixedtoright');
		return;
	}
	if (elem.classList.contains('fixedtoleft')) {
		elem.classList.remove('fixedtoleft');
		return;
	}
	if (elem.classList.contains('maximized')) {
		elem.classList.remove('maximized');
		return
	}
	elem.classList.add('maximized');
}

function increaseZIndex() {
	return windowIndex ++;
}

function increaseXPosition() {
	floatingWindowConfig.window.x += 30;
	return floatingWindowConfig.window.x + "px";
}

function increaseYPosition() {
	floatingWindowConfig.window.y += 30;
	return floatingWindowConfig.window.y + "px";
}

function getRandomColor() {
	return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}


function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
    return (hsp>127.5)
}