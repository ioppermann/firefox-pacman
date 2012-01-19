function hud(punkte, leben, level) {
	this.punkte = punkte;
	this.leben = leben;
	this.level = level;

	this.prev_punkte = this.punkte;
	this.prev_leben = this.leben;
	this.prev_level = this.level;

	this.elmPunkte = document.getElementById("pacman-hud-score");
	this.elmLeben1 = document.getElementById("pacman-hud-leben1");
	this.elmLeben2 = document.getElementById("pacman-hud-leben2");
	this.elmMessage = document.getElementById("pacman-hud-message");
	this.elmLevel = document.getElementById("pacman-hud-level");

	this.display = function() {
		this.elmPunkte.value = this.punkte;
		this.elmLevel.value = pacmanstringbundle.getString("pacman.hud_level") + " " + this.level;

		if(this.leben == 1) {
			this.elmLeben1.style.visibility = 'hidden';
			this.elmLeben2.style.visibility = 'hidden';
		}
		else if(this.leben == 2) {
			this.elmLeben1.style.visibility = '';
			this.elmLeben2.style.visibility = 'hidden';
		}
		else {
			this.elmLeben1.style.visibility = '';
			this.elmLeben2.style.visibility = '';
		}
	}

	this.update = function() {
		if(this.punkte != this.prev_punkte) {
			this.elmPunkte.value = this.punkte;
			this.prev_punkte = this.punkte;
		}

		if(this.level != this.prev_level) {
			this.elmLevel.value = pacmanstringbundle.getString("pacman.hud_level") + " " + this.level;
			this.prev_level = this.level;
		}

		if(this.leben != this.prev_leben) {
			if(this.leben == 1) {
				this.elmLeben1.style.visibility = 'hidden';
				this.elmLeben2.style.visibility = 'hidden';
			}
			else if(this.leben == 2) {
				this.elmLeben1.style.visibility = '';
				this.elmLeben2.style.visibility = 'hidden';
			}
			else {
				this.elmLeben1.style.visibility = '';
				this.elmLeben2.style.visibility = '';
			}

			this.prev_leben = this.leben;
		}
	}

	this.setMessage = function(message) {
		this.elmMessage.value = message;
	}

	this.setPunkte = function(punkte) {
		this.punkte = punkte;
	}

	this.setLevel = function(level) {
		this.level = level;
	}

	this.setLeben = function(leben) {
		this.leben = leben;
	}

	this.reset = function(punkte, leben, level) {
		this.punkte = punkte;
		this.leben = leben;
		this.level = level;
	}
}