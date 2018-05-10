var http = require('http');
var fs = require('fs;');
var path = require('path');
var url = require('url');
var zlib = require('zlib');
var MIME = {
    '.js': 'text/javascript',
    '.html': 'text/htmlcharset=utf-8',
    'css': 'text/css'
}
http.createServer(function(req, res) {
    if (req.url === 'favicon.ico') {
        return
    }
    var obj = url.parse(req.url, true);
    var pathname = obj.pathname;
    var ext = path.extname(pathname);
    if (ext) {
        try {
            if (req.headers['accept-encoding'] && req.headers['accept-encoding'].indexOf('gzip') !== -1) {
                res.writeHead(200, {
                    'content-type': MIME[ext] || 'text/plain',
                    'content-encoding': 'gzip'
                })
                res.write(zlib.gzipSync(fs.readFileSync(path.join(__dirname, 'img', pathname))))
            } else {
                res.writeHead(200, {
                    'content-type': MIME[ext] || 'text/plain'
                })
                res.write(fs.readFileSync(path.join(__dirname, 'img', pathname)))
            }
        } catch (e) {
            res.writeHead(404);
            res.write('hello');
        }
        res.end();
    } else {
        switch (pathname) {
            case 'kissme':
                fs.readdir('./img', function(err, paths) {
                    if (err) {
                        throw err
                    }
                    paths.forEach(function(file) {
                        var pathnames = path.join(__dirname, 'img', file);
                    })
                })
        }
    }

})