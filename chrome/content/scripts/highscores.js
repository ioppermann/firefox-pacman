function highscores() {
	this.getHighscores = function() {
		var highscores = new Array();

		for(var i = 0; i < 10; i++)
			highscores[i] = this.parseHighscore(pacmanGetCharPref("platz" + i, ""));

		return highscores;
	}

	this.parseHighscore = function(hs) {
		if(hs.indexOf(";") == -1)
			return new Array("0", "1", "0", "");

		var scores = hs.split(";");

		if(scores.length != 4)
			return new Array("0", "1", "0", "");

		scores[0] = parseInt(scores[0]);
		scores[1] = parseInt(scores[1]);
		scores[2] = parseInt(scores[2]);

		return scores;
	}

	this.hasHighscore = function(punkte) {
		var h = this.getHighscores();

		for(var i = 0; i < h.length; i++) {
			if(punkte >= h[i][0])
				return true;
		}

		return false;
	}

	this.setHighscore = function(name, punkte, level) {
		if(this.hasHighscore(punkte) == false)
			return false;

		var h = this.getHighscores();

		for(var i = 0; i < h.length; i++)
			h[i][2] = 0;

		for(var i = (h.length - 2); i >= 0; i--) {
			if(punkte <= h[i][0]) {
				h[i + 1] = new Array(punkte, level, 1, name);
				break;
			}
			else
				h[i + 1] = h[i];
		}

		if(h[0] == h[1])
			h[0] = new Array(punkte, level, 1, name);

		for(var i = 0; i < h.length; i++)
			pacmanSetCharPref("platz" + i, h[i][0] + ";" + h[i][1] + ";" + h[i][2] + ";" + h[i][3])

		return true;
	}
}

function pacmanLoadHighscores() {
	var hs = new highscores();

	var h = hs.getHighscores();

	var list = document.getElementById("highscores-list");

	var listitem = null;
	var listcell = null;

	for(var i = 0; i < h.length; i++) {
		listitem = document.createElement("listitem");

		listcell = document.createElement("listcell");
		listcell.setAttribute("label", i + 1);

		listitem.appendChild(listcell);

		listcell = document.createElement("listcell");
		listcell.setAttribute("label", h[i][3]);

		listitem.appendChild(listcell);

		listcell = document.createElement("listcell");
		listcell.setAttribute("label", h[i][0]);

		listitem.appendChild(listcell);

		listcell = document.createElement("listcell");
		listcell.setAttribute("label", h[i][1]);

		listitem.appendChild(listcell);
		if(h[i][2] == 1)
			listitem.style.backgroundColor = "#C000C0";

		list.appendChild(listitem);
	}

	return true;
}

function pacmanSetHighscore() {
	var name = document.getElementById("pacman-highscore-name").value;
	var punkte = window.arguments[0];
	var level = window.arguments[1];

	var hs = new highscores();

	hs.setHighscore(name, punkte, level);

	return true;
}
