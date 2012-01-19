function pacmanGetBoolPref(name, defval) {
	var pref = defval;

	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	if(prefs.getPrefType(name) == prefs.PREF_BOOL)
		pref = prefs.getBoolPref(name);

	return pref;
}

function pacmanSetBoolPref(name, value) {
	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	prefs.setBoolPref(name, value);

	return true;
}

function pacmanGetCharPref(name, defval) {
	var pref = defval;

	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	if(prefs.getPrefType(name) == prefs.PREF_STRING)
		pref = prefs.getCharPref(name);

	return pref;
}

function pacmanSetCharPref(name, value) {
	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	prefs.setCharPref(name, value);

	return true;
}

function pacmanGetIntPref(name, defval) {
	var pref = defval;

	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	if(prefs.getPrefType(name) == prefs.PREF_INT)
		pref = prefs.getIntPref(name);

	return pref;
}

function pacmanSetIntPref(name, value) {
	var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var prefs = prefservice.getBranch("pacmangame.");

	prefs.setIntPref(name, value);

	return true;
}
