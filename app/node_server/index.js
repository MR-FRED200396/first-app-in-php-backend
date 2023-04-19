const http = require('http');
const https = require('https');
const url = require('url');
const { parse } = require('querystring');
const fs = require('fs');


http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('server work');
    if (req.method == 'GET') {
        const parsed = req.url.split('/');
        if (parsed.includes('files')) {
            fs.readFile('./files/'+parsed[parsed.length-1], function(error, content) {
                if (error) {
                    res.end('false');
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else {
            res.end('server work');
        }
    }
    else {
        // POST
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let params = JSON.parse(body);
            switch (params.action) {
                case 1:
                    console.log('action 1');
                    let time = new Date();
                    res.end(time.toString());
                    break;
                case 2:
                    console.log('action 2');
                    let min = +params.num1;
                    let max = +params.num2;
                    let rand = Math.floor(Math.random() * (max - min)) + min;
                    res.end(rand.toString());
                    break;
                case 3:
                    console.log('action 3');
                    let filename = params.filename;
                    let filedata = params.filedata;
                    fs.appendFile('./files/' + filename, filedata, function (err) {
                        if (err) throw err;
                        res.end(filename);
                    });
                    break;
                case 4:
                    console.log('action 4');
                    let d = req.headers['user-agent'];
                    res.end(d);
                    break;
            }
        });
    }

}).listen(3500);