fs = require('fs');
path = require('path');

var dirs = ['.'];
var files = [];
var definitions = {};

function main() {
	scanDirs();
	scanFiles();
	
	for (var i in definitions) {
		var def = definitions[i];
		def.actions = def.actions.map(removeFrontTab).join("\r\n");
		def.comments = def.comments.join("\r\n");
	}

	fs.writeFileSync('definitions.js', 'definitions = '+JSON.stringify(definitions));
}

function removeFrontTab(line) {
	if (line[0] == '\t')
		line = line.substr(1);
	return line;
}

function scanDirs() {
	while(dirs.length > 0) {
		var p = dirs.shift();
		fs.readdirSync(p).forEach(function(f) {
			var np = path.join(p, f);
			stat = fs.statSync(np);

			if (stat.isDirectory()) {
				dirs.push(np);
			}
			if (stat.isFile()) {
				files.push(np);
			}
		});
	}
}

function ending(f) {
	var pos = f.lastIndexOf('.');
	if (pos == -1) return '';
	return f.substr(pos+1).toLowerCase();
}

function scanFiles(file) {
	files.forEach(function(f) {
		var e = ending(f);
		if (e != 'spt' && e != 'if') return; // continue
		console.log("FILE:"+f);
		var data = fs.readFileSync(f);
		parse_if(data.toString().split('\n'));
	});
}

function parse_if(lines) {
	var quoteCount = 0;
	var inDefinition = false;
	var definitionName = '';
	var commentLines = [];
	lines.forEach(function(line) {
		if (!line.match(/^[ \t]*#/)) {
			var m = line.match(/(`)/g);
			if (m) {
				quoteCount += m.length;
			}
			var m = line.match(/(')/g);
			if (m) {
				quoteCount -= m.length;
			}
		}
		if (!inDefinition) {
			var m = line.match(/^##.*$/);
			if (m) {
				if (line[2] == '#')
					commentLines = [];
				else
					commentLines.push(line);
			}
			var m = line.match(/^(?:define|interface|template)\(`([^']+)',[ \t]*`$/);
			if (m) {
				definitionName = m[1];
				definitions[definitionName] = {actions: [], comments:commentLines.slice()};
				inDefinition = true;
			} else {
				var m = line.match(/^(?:define|interface|template)\(`([^']+)',[ \t]*`([^']+)'\)$/);
				if (m) {
					definitions[m[1]] = {actions: [m[2]], comments:commentLines.slice()};
				}
			}
		} else {
			if (quoteCount == 0)
				inDefinition = false;
			else
				definitions[definitionName].actions.push(line);
		}
	});
}

main();

