//The following code shows how to read values from an HTML form. As @pimvdb said you need to use the request.on('data'...) to capture the contents of the body.
var http, path, fs;
http = require('http');
path = require('path');
fs = require('fs');

var CWD = process.cwd();
server = http.createServer( function(req, res) {

    console.log('request\'s URL:',req.url,req.param,req);
	var filePath = './'+req.url;
    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
			console.log("Partial body: " + body);
		}).on('end', function () {
            console.log("full body: " + body);
            fs.exists(filePath,function (e){
                if (!e) console.log('exists: ',e); 
                fs.stat(filePath,function (err,stat){ 
                    if (err) console.log('error:',err); 
                    fs.open(filePath,'w+', function (err,fd){
                        console.log('err:',err,'fd:',fd);
                        var buff = new Buffer(((stat&&stat.size)||body.length));
                        fs.write(fd,body,0,body.length,'w+',function (err,bytesRead,buff){
                            console.log('err:',err,'bytesRead:',bytesRead,'buff:',buff.toString());
                        });
                    });
                });
            });
			//fs.writeFileSync('./'+req.url,body,{encoding:'utf8',flag:'w'});
        });
        req.on('end', function () {
            console.log("Body: " + body, 'end');
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('post received');
        });
		req.on('error',function (){
			res.writeHead(404,{'content-Type':'text/plain'}); 
			console.log(e);
			res.end(e.toString());			
		});
    } else {
		try {
			console.log("GET");
			//var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
			if (req.url.length <= 2) {
				console.log('req.url.length:',req.url.length);
			    var html = fs.readFileSync('./page.html');
			} else 
				var html = fs.readFileSync('./'+req.url);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(html);
		} catch (e) {
			res.writeHead(404,{'content-Type':'text/plain'}); 
			console.log(e);
			res.end(e.toString());
		}
    }
});

port = 3002;
host = '127.0.0.1';
server.listen(port, host, function (){
	console.log('Listening at http://' + host + ':' + port);
	console.log('current working directory:',CWD);
});