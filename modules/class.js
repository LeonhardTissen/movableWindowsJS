let windowIndex = 0;

export const floatingWindowConfig = {
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

export class FloatingWindow {
	constructor(width = 600, height = 400, content = "") {
		this.window = document.createElement('div');
		this.window.style.position = 'fixed';
		this.window.style.top = floatingWindowConfig.window.x + "px";
		this.window.style.left = floatingWindowConfig.window.y + "px";
		this.window.style.zIndex = increaseZIndex();
		floatingWindowConfig.window.x += 30;
		floatingWindowConfig.window.y += 30;
		this.window.style.width = width + "px";
		this.window.style.height = height + "px";
		this.window.style.borderRadius = floatingWindowConfig.window.borderRadius + "px";
		this.window.style.overflow = "hidden";
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
		var tb = floatingWindowConfig.taskBar;
		this.windowTaskbar.onmousedown = function() {
			this.parentElement.setAttribute('held', 'true')
			this.parentElement.style.zIndex = increaseZIndex();
		}
		this.windowTaskbar.style.boxShadow = `inset 0px 10px 10px #FFF4, inset 0px -5px 10px #0004`
		this.windowTaskbar.style.backgroundColor = floatingWindowConfig.taskBar.color;
		this.windowTaskbar.style.height = floatingWindowConfig.taskBar.height + "px";
		this.window.appendChild(this.windowTaskbar);

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