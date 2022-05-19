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
	constructor(width = 600, height = 400, content = "") {
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

		this.windowActions = document.createElement('div')
		this.windowActions.classList.add('actions')
		this.windowActions.style.right = 0;
		this.windowActions.style.position = "absolute";
		this.windowActions.style.height = floatingWindowConfig.taskBar.height + "px";
		var padding = floatingWindowConfig.taskBar.height / 2 - 10 + "px"
		this.windowActions.innerHTML = `
			<div class="action"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<rect x="20" y="9" width="10" height="2" stroke="black"></rect>
				</svg>
			</div>
			<div class="action"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<rect x="20" y="7" width="10" height="8" fill="none" stroke="black"></rect>
					<path d="M23,6 23,4 33,4 33,12 31,12" fill="none" stroke="black"></path>
				</svg>
			</div>
			<div class="action"> 
				<svg width="50" height="20" style="padding-top: ${padding}; padding-bottom: ${padding};">
					<path d="M20,5 30,15" fill="none" stroke="black" stroke-width="2"></path>
					<path d="M20,15 30,5" fill="none" stroke="black" stroke-width="2"></path>
				</svg>
			</div>`
		this.windowTaskbar.appendChild(this.windowActions)

		this.windowContent = document.createElement('div');
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