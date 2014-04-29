/**
 * a web server for serving up static content
 */
var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = 8080;

var CONTENT_PATH = '/content/'

function handle_incoming_request(req, res) {
	if (req.method.toLowerCase() == 'get'
		&& req.url.substring(0, CONTENT_PATH.length) == CONTENT_PATH) {
		// pass filename as arg
 		pipe_dat(req.url.substring(CONTENT_PATH.length), res);
	} else {
		send_404(res, req.url);
	}
}

function serve_static_file(file, res) {
	console.log("let's read file " + file + "...");

	var rs = fs.createReadStream(file);
	var ct = content_type_for_path(file);
	console.log(ct);
	if (!ct) {
		send_404(res, file);
	}

	res.writeHead(200, {
		"Content-Type" : ct
	});

	rs.on('readable', function() {
		var d = rs.read();
		if (d) {
			if (typeof d === 'string')
				res.write(d);
			else if (typeof d === 'object' && d instanceof Buffer)
				res.write(d.toString('utf8'));
		}
	});

	rs.on('end', function() {
		res.end();
	});

	rs.on('error', function() {
		send_404(res, file);
	});
}

function pipe_dat(file, res) {
	console.log('laying some pipe on file ' + file + '...');
	
	fs.exists(file, function(exists) {
		if(!exists) {
			res.writeHead(404, {"Content-Type" : "application/json"});
			var out = {error: "not_found", message: "'" + file + "' not found"};
			res.end(JSON.stringify(out) + "\n");
		}
		
		var rs = fs.createReadStream(file);
		rs.on('error', function(e) {
			console.log('Error! ' + JSON.stringify(e));
			res.end();
		});
		
		var ct = content_type_for_path(file);
		res.writeHead(200, {'Content-Type' : ct});
		rs.pipe(res);
	});
}

function content_type_for_path(file) {
	var ext = path.extname(file).toLowerCase();
	
	switch (ext) {
	case '.html':
		return 'text/html';
	case '.json':
		return 'text/json';
	case '.js':
		return 'text/javascript';
	default:
		return 'text/plain';
	}
}

function send_404(res, file) {
	res.writeHead(404, {
		"Content-Type" : "application/json"
	});
	var out = {
		error : "not_found",
		message : "'" + file + "' not found"
	};
	res.end(JSON.stringify(out) + "\n");
}

var s = http.createServer(handle_incoming_request);
s.listen(PORT, function() {
	console.log("Listening on port " + PORT + "...");
});