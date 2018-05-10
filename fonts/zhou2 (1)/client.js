var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var zlib = require('zlib'); //定义模块

var MIME = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.image': 'image/jpg'
}
http.createServer(function(req, res) {
    if (req.url === '/favicon.ico') {
        return
    }
    var obj = url.parse(req.url, true);
    var pathname = obj.pathname;
    var ext = path.extname(pathname);
    var query = obj.query;
    if (ext) { //文件
        try {
            var app = fs.readFileSync(path.join(__dirname, pathname))
            if (req.headers['accept-encoding'] && req.headers['accept-encoding'].indexOf('gzip') !== -1) {
                zlib.gzip(app, function(err, encoded) {
                    if (err) {
                        throw err
                    }
                    res.writeHead(200, {
                        'content-type': MIME[ext] || 'text/plain',
                        'content-encoding': 'gzip'
                    })
                    res.end(encoded)
                })
            } else {
                res.writeHead(200, {
                    'content-type': MIME[ext] || 'text/plain'
                })
                res.end(app)
            }
        } catch (e) {
            res.writeHead(404);
            res.end('hello world');
        }
    } else { //接口
        if (pathname === '/getUser') {
            fs.readdir('./img', function(err, paths) {
                if (err) {
                    throw err
                }
                paths.forEach(function(file) {
                    var images = path.join(__dirname, './img', file);
                    fs.stat(images, function(err, st) {
                        var size = Math.round(st.size / 1024);

                        if (size > query.minsize && size < query.maxsize) {
                            res.end(JSON.stringify({ src: path.join('./img', file), size: size, time: st.ctime }))
                        }
                    })
                })
            })
        }
    }
}).listen(8009);