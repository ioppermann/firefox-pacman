var pacmanstringbundle = null;

var pacmangame = {
	offset_top: 79,
	offset_left: 37,
	offset_pille: 6,
	offset_figur: 20,
	gap: 14,

	isrunning: false,
	ispause: false,
	isready: true,
	isinterupted: false,
	isgameover: false,

	soundplayer: null,
	hud: null,
	highscores: null,

	pacman: null,
	waypoints: null,
	geister: null,
	bonus: null,

	punkte: 0,
	prev_punkte: 0,
	default_punkte: 0,

	leben: 3,
	default_leben: 3,

	level: 1,
	default_level: 1,

	default_velocity: 200,
	velocity: 200,
	velocity_option: 1,

	available_dots: 0,
	eaten_dots: 0,
	eaten_geister: 0,

	geist_bilder: null,
	pacman_bilder: null,
	bonus_bilder: null,

	bonusmessage_timeout: null,
	bonus_timeout: null,

	pacman_timeout: null,
	geist_timeout: new Array(4),

	map: [],

	initWaypoints: function() {
		this.map = generate_map();

		this.waypoints = new Array();

		var wp = 0;
		var id = 0;

		for(var i = 0; i < this.map.length; i++) {
			for(var j = 0; j < this.map[i].length; j++) {
				if(this.map[i][j] == -1)
					continue;

				id = i * this.map.length + j;

				this.waypoints[wp] = new waypoint(id, i, j, this.map[i][j]);
				if(wp != 0) {
					this.waypoints[wp].setPrevWaypoint(this.waypoints[wp - 1]);
					this.waypoints[wp - 1].setNextWaypoint(this.waypoints[wp]);
				}

				wp++;
			}
		}

		var stack = document.getElementById("pacman-spielfeld-stack");
		var img = null;

		for(var i = 0; i < this.waypoints.length; i++) {
			this.waypoints[i].findNeighbours();

			if(this.waypoints[i].type != 1 && this.waypoints[i].type != 2)
					continue;

			img = document.createElement("image");
			img.setAttribute("id", "pacman-dot" + this.waypoints[i].id);

			if(this.waypoints[i].type == 1) {
				img.setAttribute("src", "chrome://pacman/skin/images/dot.png");
				img.setAttribute('top', this.offset_top + (this.waypoints[i].top * this.gap));
				img.setAttribute('left', this.offset_left + (this.waypoints[i].left * this.gap));
				img.setAttribute('width', '4');
				img.setAttribute('height', '4');
				this.available_dots++;
			}
			else if(this.waypoints[i].type == 2) {
				img.setAttribute("src", "chrome://pacman/skin/images/pille.png");
				img.setAttribute('top', this.offset_top + (this.waypoints[i].top * this.gap) - this.offset_pille);
				img.setAttribute('left', this.offset_left + (this.waypoints[i].left * this.gap) - this.offset_pille);
				img.setAttribute('width', '16');
				img.setAttribute('height', '16');
				this.available_dots++;
			}

			img.style.display = "none";

			stack.appendChild(img);
		}
	},

	initFiguren: function() {
		var stack = document.getElementById("pacman-spielfeld-stack");

		if(!stack)
			return;

		/* Boni */

		for(var i = 0; i < this.waypoints.length; i++) {
			if(this.waypoints[i].type == 3) {
				this.bonus = new bonus(this.waypoints[i]);
				break;
			}
		}

		this.bonus_bilder = new Array(5);

		var img = null;

		for(var i = 0; i < 5; i++) {
			img = document.createElement("image");
			img.setAttribute("id", "bonus" + i);
			img.setAttribute("src", "chrome://pacman/skin/images/bonus_" + i + ".png");
			img.setAttribute('width', '44');
			img.setAttribute('height', '44');
			img.style.display = 'none';
			stack.appendChild(img);

			this.bonus_bilder[i] = img;
		}


		/* Pacman */

		for(var i = 0; i < this.waypoints.length; i++) {
			if(this.waypoints[i].type == 4) {
				this.pacman = new pacman(this.waypoints[i]);
				break;
			}
		}

		this.pacman_bilder = new Array(4);

		this.pacman_bilder[0] = new Array(2);
		this.pacman_bilder[1] = new Array(2);
		this.pacman_bilder[2] = new Array(2);
		this.pacman_bilder[3] = new Array(2);

		img = document.createElement("image");
		img.setAttribute("id", "pacman-player_0_0");
		img.setAttribute("src", "chrome://pacman/skin/images/pack_0_0.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.pacman_bilder[0][0] = img;
		this.pacman_bilder[1][0] = img;
		this.pacman_bilder[2][0] = img;
		this.pacman_bilder[3][0] = img;

		img = document.createElement("image");
		img.setAttribute("id", "pacman-player_0_1");
		img.setAttribute("src", "chrome://pacman/skin/images/pack_0_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.pacman_bilder[0][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "pacman-player_1_1");
		img.setAttribute("src", "chrome://pacman/skin/images/pack_1_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.pacman_bilder[1][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "pacman-player_2_1");
		img.setAttribute("src", "chrome://pacman/skin/images/pack_2_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.pacman_bilder[2][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "pacman-player_3_1");
		img.setAttribute("src", "chrome://pacman/skin/images/pack_3_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.pacman_bilder[3][1] = img;

		this.pacman_timeout = null;


		/* Geister */

		var geist_count = 0;
		this.geister = new Array();
		for(var i = 0; i < this.waypoints.length; i++) {
			if(this.waypoints[i].type == 5) {
				this.geister[geist_count] = new geist(this.waypoints[i], geist_count);
				geist_count++;
			}
		}

		this.geist_bilder = new Array(4);

		this.geist_bilder[0] = new Array(6);

		img = document.createElement("image");
		img.setAttribute("id", "geist0_0");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][0] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist0_1");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist0_2");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][2] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist0_3");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][3] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist0_4");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][4] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist0_5");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[0][5] = img;

		this.geist_timeout[0] = null;


		this.geist_bilder[1] = new Array(6);

		img = document.createElement("image");
		img.setAttribute("id", "geist1_0");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][0] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist1_1");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist1_2");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][2] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist1_3");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][3] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist1_4");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][4] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist1_5");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[1][5] = img;

		this.geist_timeout[1] = null;


		this.geist_bilder[2] = new Array(6);

		img = document.createElement("image");
		img.setAttribute("id", "geist2_0");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][0] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist2_1");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist2_2");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][2] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist2_3");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][3] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist2_4");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][4] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist2_5");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[2][5] = img;

		this.geist_timeout[2] = null;


		this.geist_bilder[3] = new Array(6);

		img = document.createElement("image");
		img.setAttribute("id", "geist3_0");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][0] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist3_1");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][1] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist3_2");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][2] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist3_3");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][3] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist3_4");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_0_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][4] = img;

		img = document.createElement("image");
		img.setAttribute("id", "geist3_5");
		img.setAttribute("src", "chrome://pacman/skin/images/geist_1_eatable_w.png");
		img.setAttribute('width', '44');
		img.setAttribute('height', '44');
		img.style.display = 'none';
		stack.appendChild(img);

		this.geist_bilder[3][5] = img;

		this.geist_timeout[3] = null;
	},

	resetWaypoints: function() {
		var img = null;

		for(var i = 0; i < this.waypoints.length; i++) {
			this.waypoints[i].passthrough = false;

			if(this.waypoints[i].type != 1 && this.waypoints[i].type != 2)
					continue;

			img = document.getElementById("pacman-dot" + this.waypoints[i].id);
			img.style.display = "";
		}

		this.eaten_dots = 0;
	},

	resetPacman: function() {
		for(var i = 0; i < this.pacman_bilder.length; i++) {
			this.pacman_bilder[i][0].style.display = 'none';
			this.pacman_bilder[i][1].style.display = 'none';
		}

		this.pacman.reset();
	},

	resetGeister: function() {
		this.resetGeist(0);
		this.resetGeist(1);
		this.resetGeist(2);
		this.resetGeist(3);

		this.eaten_geister = 0;
	},

	resetGeist: function(nr) {
		for(var i = 0; i < 6; i++)
			this.geist_bilder[nr][i].style.display = 'none';

		this.geister[nr].reset();
	},

	resetVelocity: function() {
		switch(this.velocity_option) {
			case 1:
				this.velocity = this.default_velocity;
				break;
			case 3:
				this.velocity = 100;
				break;
			case 4:
				this.velocity = 50;
				break;
			default:
				this.velocity = this.default_velocity - ((this.level - 1) * 10);
				break;
		}

		if(this.velocity <= 50)
			this.velocity = 50;
	},

	restartGame: function() {
		this.resetWaypoints();

		this.resetPacman();

		this.resetGeister();

		this.resetVelocity();

		this.hud.display();

		this.resetBonus();

		this.update(-2);
	},

	resetGame: function() {
		this.resetPacman();

		this.resetGeister();

		this.hud.display();

		this.resetBonus();

		this.update(-2);
	},

	newGame: function(velocity) {
		this.stopGame();

		this.velocity_option = velocity;
		this.punkte = this.default_punkte;
		this.hud.setPunkte(this.punkte);
		this.leben = this.default_leben;
		this.hud.setLeben(this.leben);
		this.level = this.default_level;
		this.hud.setLevel(this.level);

		this.isrunning = false;
		this.ispause = false;
		this.isready = true;
		this.isinterupted = false;
		this.isgameover = false;

		this.restartGame();
	},

	initGame: function(velocity) {
		/* das Stringbundle importieren */
		pacmanstringbundle = document.getElementById("pacman-stringbundle");

		/* den Soundserver initialisieren */
		this.soundplayer = new sound();

		/* die Waypoints initialisieren */
		this.initWaypoints();

		/* die Spielfiguren initialisieren */
		this.initFiguren();

		/* das HUD initialisieren */
		this.hud = new hud(this.punkte, this.leben, this.level);

		/* die Highscores initialisieren */
		this.highscores = new highscores();

		/* das Spiel neu starten (restartGame) */
		this.newGame(velocity);
	},

	quitGame: function() {
		this.stopGame();
	},

	moveLeft: function() {
		this.pacman.moveLeft();
	},

	moveRight: function() {
		this.pacman.moveRight();
	},

	moveUp: function() {
		this.pacman.moveUp();

		if(!this.isrunning && this.isready && !this.isinterupted)
			this.startGame();
	},

	moveDown: function() {
		this.pacman.moveDown();

		if(!this.isrunning && this.isready && !this.isinterupted)
			this.startGame();
	},

	update: function(id) {
		var img = null;
		var top = 0;
		var left = 0;
		var stage = 0;
		var stage_offset = 0;

		if(id == -1 || id == -2) {
			top = (this.offset_top + (this.pacman.currentwaypoint.top * this.gap) - this.offset_figur);
			left = (this.offset_left + (this.pacman.currentwaypoint.left * this.gap) - this.offset_figur);

			stage = this.pacman.animstage;

			img = this.pacman_bilder[this.pacman.direction][stage];
			img.setAttribute('top', top);
			img.setAttribute('left', left);
			img.style.display = '';

			stage = (stage == 0) ? 1 : 0;

			this.pacman_bilder[this.pacman.prev_direction][stage].style.display = 'none';
		}

		if(id == 0 || id == -2) {
			top = (this.offset_top + (this.geister[0].currentwaypoint.top * this.gap) - this.offset_figur);
			left = (this.offset_left + (this.geister[0].currentwaypoint.left * this.gap) - this.offset_figur);

			img = this.geist_bilder[0][this.geister[0].animstage];
			img.setAttribute('top', top);
			img.setAttribute('left', left);
			img.style.display = '';

			this.geist_bilder[0][this.geister[0].prev_animstage].style.display = 'none';
		}

		if(id == 1 || id == -2) {
			top = (this.offset_top + (this.geister[1].currentwaypoint.top * this.gap) - this.offset_figur);
			left = (this.offset_left + (this.geister[1].currentwaypoint.left * this.gap) - this.offset_figur);

			img = this.geist_bilder[1][this.geister[1].animstage];
			img.setAttribute('top', top);
			img.setAttribute('left', left);
			img.style.display = '';

			this.geist_bilder[1][this.geister[1].prev_animstage].style.display = 'none';
		}

		if(id == 2 || id == -2) {
			top = (this.offset_top + (this.geister[2].currentwaypoint.top * this.gap) - this.offset_figur);
			left = (this.offset_left + (this.geister[2].currentwaypoint.left * this.gap) - this.offset_figur);

			img = this.geist_bilder[2][this.geister[2].animstage];
			img.setAttribute('top', top);
			img.setAttribute('left', left);
			img.style.display = '';

			this.geist_bilder[2][this.geister[2].prev_animstage].style.display = 'none';
		}

		if(id == 3 || id == -2) {
			top = (this.offset_top + (this.geister[3].currentwaypoint.top * this.gap) - this.offset_figur);
			left = (this.offset_left + (this.geister[3].currentwaypoint.left * this.gap) - this.offset_figur);

			img = this.geist_bilder[3][this.geister[3].animstage];
			img.setAttribute('top', top);
			img.setAttribute('left', left);
			img.style.display = '';

			this.geist_bilder[3][this.geister[3].prev_animstage].style.display = 'none';
		}

		this.hud.update();
		if(!this.isrunning && this.isready && !this.isinterupted)
			this.hud.setMessage(pacmanstringbundle.getString("pacman.message_ready"));

		if(this.isrunning) {
			this.bonus.update();
			if(this.bonus.showBonus() == true) {
				this.bonus.waypoint.bonus = true;

				top = (this.offset_top + (this.bonus.waypoint.top * this.gap) - this.offset_figur);
				left = (this.offset_left + (this.bonus.waypoint.left * this.gap) - this.offset_figur);

				img = this.bonus_bilder[(this.level - 1) % 5];
				img.setAttribute('top', top);
				img.setAttribute('left', left);
				img.style.display = '';

				setTimeout("pacmangame.resetBonus()", 15000 - ((this.level - 1) * 150));
			}
		}
	},

	pacmanLoop: function() {
		var img = null;
		var haseaten = false;
		var geist = null;
		var sound_played = false;

		if(!this.isrunning)
			return;

		if(this.pacman_timeout != null) {
			clearTimeout(this.pacman_timeout);
			this.pacman_timeout = null;
		}

		this.pacman.update();

		if(this.pacman.currentwaypoint.passthrough == false) {
			if(this.pacman.currentwaypoint.type == 1) {
				this.punkte += 10;
				img = document.getElementById("pacman-dot" + this.pacman.currentwaypoint.id);
				img.style.display = "none";
				haseaten = true;

				this.soundplayer.play(this.soundplayer.DOT);
				sound_played = true;
			}
			else if(this.pacman.currentwaypoint.type == 2) {
				this.punkte += 50;
				img = document.getElementById("pacman-dot" + this.pacman.currentwaypoint.id);
				img.style.display = "none";
				haseaten = true;

				this.eaten_geister = 0;

				this.soundplayer.play(this.soundplayer.DOT);
				sound_played = true;

				for(var i = 0; i < this.geister.length; i++)
					this.geister[i].setEatable();
			}

			this.pacman.currentwaypoint.passthrough = true;
		}

		if(this.pacman.currentwaypoint.type == 3 && this.pacman.currentwaypoint.bonus == true) {
			var p = 100 + ((this.level - 1) * 200);
			this.punkte += p;
			this.resetBonus();

			this.soundplayer.play(this.soundplayer.EAT);
			this.interuptGame(3000, 1);
			sound_played = true;

			this.setBonusMessage(pacmanstringbundle.getString("pacman.message_bonus") + ' ' + p, 3000);
		}

		if((geist = this.pacman.hasGeist()) != null) {
			this.eaten_geister++;

			var p = (Math.pow(2, this.eaten_geister - 1) * 200);
			this.punkte += p;

			this.soundplayer.play(this.soundplayer.EAT);
			this.interuptGame(3000, 1);
			sound_played = true;

			this.setBonusMessage(pacmanstringbundle.getString("pacman.message_bonus") + ' ' + p, 3000);

			this.resetGeist(geist.id);
		}

		if((this.prev_punkte < 10000 && this.punkte >= 10000) || (this.prev_punkte < 50000 && this.punkte >= 50000)) {
			this.leben++;
			this.hud.setLeben(this.leben);
			this.setBonusMessage(pacmanstringbundle.getString("pacman.message_extralive"), 1000);

			this.soundplayer.play(this.soundplayer.EXTRA);
			this.interuptGame(1000, 1);
			sound_played = true;
		}

		if(!sound_played)
			this.soundplayer.play(this.soundplayer.IDLE);

		this.prev_punkte = this.punkte;

		this.hud.setPunkte(this.punkte);
		this.update(-1);

		var v = this.velocity;
		if(haseaten) {
			this.eaten_dots++;
			v += 35;
		}

		if(this.eaten_dots >= this.available_dots) {
			this.level++;

			this.hud.setLevel(this.level);

			this.stopGame();
			this.restartGame();

			return;
		}

		this.pacman_timeout = setTimeout("pacmangame.pacmanLoop()", v);
	},

	geistLoop: function(nr) {
		if(!this.isrunning)
			return;

		if(this.geist_timeout[nr] != null) {
			clearTimeout(this.geist_timeout[nr]);
			this.geist_timeout[nr] = null;
		}


		this.geister[nr].update();

		if(this.geister[nr].currentwaypoint.type == 9)
			this.geister[nr].inhouse = false;

		this.update(nr);

		if(this.geister[nr].eatable != true && this.geister[nr].hasPacman() == true) {
			this.leben--;

			this.hud.setLeben(this.leben);

			this.soundplayer.play(this.soundplayer.DEATH);
			this.interuptGame(4000, 0);

			this.stopGame();

			if(this.leben <= 0) {
				this.isgameover = true;
				this.isready = false;
				this.hud.setMessage(pacmanstringbundle.getString("pacman.message_gameover"));

				if(this.highscores.hasHighscore(this.punkte) == true) {
					pacmanHighscoresName(this.punkte, this.level);
					pacmanShowHighscores();
				}
			}
			else
				this.resetGame();

			return;
		}

		var v = this.velocity;
		if(this.geister[nr].eatable == true)
			v += 175;
		else
			v += 100;

		switch(this.velocity_option) {
			case 1:
				break;
			case 3:
			case 4:
				v -= 75;
			default:
				v -= ((this.level - 1) * 10);
				break;
		}

		if(v < 50)
			v = 50;

		this.geist_timeout[nr] = setTimeout("pacmangame.geistLoop(" + nr + ")", v);
	},

	startGame: function() {
		if(this.ispause || this.isgameover)
			return;

		this.hud.setMessage("");
		this.bonus.start();

		this.isrunning = true;

		this.pacmanLoop();
		this.geistLoop(0);
		this.geistLoop(1);
		this.geistLoop(2);
		this.geistLoop(3);
	},

	stopGame: function() {
		this.isrunning = false;

		if(this.bonus_timeout)
			clearTimeout(this.bonus_timeout);
	},

	pauseGame: function() {
		if(!this.isrunning && !this.ispause)
			return;

		this.ispause = !this.ispause;

		if(this.isrunning) {
			this.hud.setMessage(pacmanstringbundle.getString("pacman.message_pause"));
			this.stopGame();
		}
		else {
			this.hud.setMessage("");
			this.startGame();
		}
	},

	interuptGame: function(duration, restart) {
		this.isinterupted = true;
		this.stopGame();

		setTimeout("pacmangame.uninteruptGame(" + restart + ")", duration);
	},

	uninteruptGame: function(restart) {
		this.isinterupted = false;

		if(restart == 1)
			this.startGame();
	},

	toggleSound: function() {
		var s = this.soundplayer.toggleSound();

		if(s)
			document.getElementById("btn.sound").label = pacmanstringbundle.getString("pacman.sound_off");
		else
			document.getElementById("btn.sound").label = pacmanstringbundle.getString("pacman.sound_on");
	},

	setBonusMessage: function(message, duration) {
		if(this.bonusmessage_timeout != null)
			clearTimeout(this.bonusmessage_timeout);

		this.hud.setMessage(message);

		this.bonusmessage_timeout = setTimeout("pacmangame.clearBonusMessage()", duration);
	},

	clearBonusMessage: function() {
		this.hud.setMessage("");

		this.bonusmessage_timeout = null;
	},

	resetBonus: function() {
		this.bonus.waypoint.bonus = false;
		this.bonus.start();

		for(var i = 0; i < 5; i++)
			this.bonus_bilder[i].style.display = 'none';

		this.bonus_timeout = null;
	}
};

function pacmanInitGame() {
	var velocity = pacmanGetIntPref('velocity_option', 2);
	var speeds = new Array('dummy', 'slow', 'normal', 'fast', 'insane');
	var m = null;

	for(var i = 1; i < speeds.length; i++) {
		m = document.getElementById("pacman-speed-" + speeds[i]);
		if(velocity == i)
			m.setAttribute('checked', 'true');
		else
			m.removeAttribute('checked');
	}

	pacmangame.initGame(velocity);

	return true;
}

function pacmanQuitGame() {
	pacmangame.quitGame();

	return true;
}

function pacmanNewGame(velocity) {
	if(!velocity)
		velocity = pacmanGetIntPref('velocity_option', 2);
	else
		pacmanSetIntPref('velocity_option', velocity);

	pacmangame.newGame(velocity);

	return true;
}

function pacmanTogglePause() {
	pacmangame.pauseGame();

	return true;
}

function pacmanPauseGame() {
	if(!pacmangame.ispause)
		pacmanTogglePause();

	return true;
}

function pacmanToggleSound() {
	pacmangame.toggleSound();

	return true;
}

function pacmanMoveUp() {
	pacmangame.moveUp();

	return true;
}

function pacmanMoveRight() {
	pacmangame.moveRight();

	return true;
}

function pacmanMoveDown() {
	pacmangame.moveDown();

	return true;
}

function pacmanMoveLeft() {
	pacmangame.moveLeft();

	return true;
}

