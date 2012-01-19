
var packman = {
	moveLeft: function() {
		alert('links');
	},

	moveRight: function() {
		alert('rechts');
	},

	moveUp: function() {
		alert('hoch');
	},

	moveDown: function() {
		alert('runter');
	}
};

function packmanNewGame() {
	alert('noch nichts');
}

function packmanTogglePause() {
	alert('auch noch nichts');
}

function packmanShowSettings() {
	alert('highscoreliste');
}

function packmanLaunchGame() {
	window.open('chrome://packman/content/packman.xul', 'packman-main-window', 'chrome,resizable=off,dialog=no');
}
