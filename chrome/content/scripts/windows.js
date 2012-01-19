function pacmanShowHighscores() {
	window.openDialog('chrome://pacman/content/pacmanHighscores.xul', 'pacman-highscore-window', 'chrome,resizable=no,dialog=yes,modal=yes,centerscreen=yes');
}

function pacmanLaunchGame() {
	window.open('chrome://pacman/content/pacman.xul', 'pacman-main-window', 'chrome,resizable=no,dialog=no,modal=no');
}

function pacmanInfo() {
	window.openDialog('chrome://pacman/content/pacmanInfo.xul', 'pacman-info-window', 'chrome,resizable=no,dialog=yes,modal=yes,centerscreen=yes');
}

function pacmanHighscoresName(punkte, level) {
	window.openDialog('chrome://pacman/content/pacmanHighscoresName.xul', 'pacman-highscorename-window', 'chrome,resizable=no,dialog=yes,modal=yes,centerscreen=yes', punkte, level);
}
