// methods' declaration
const http = require('http')
const path = require('path')
const fs = require('fs')

// server's address
const host = '127.0.0.1';
const port = 5555;

function odpowiedz(req, res)
{
    // paths
    const html = path.join(__dirname, 'index.html');
    const css = path.join(__dirname, 'style.css');
    const script = path.join(__dirname, 'script.js');
    const favicon = path.join(__dirname, 'favicon.ico');

    // home page
    if(req.url === '/')
    {
        fs.readFile(html, (err, data)=>{
            if(!err)
            {
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.end(`${data}`);
                console.log(`Otwarto stronę ${req.url}`);
            }
            else
            {
                res.writeHead(404, {'Content-Type':'text/html'});
                console.dir(err);
                res.end(`<h3>Strona o podanym adresie nie istnieje</h3>`);
            }
        });
    }

    // css
    if(req.url === '/style.css')
    {
        fs.readFile(css, (err, data)=>{
            if(!err)
            {
                res.writeHead(200, {'Content-Type':'text/css; charset=utf-8'});
                res.end(`${data}`);
                console.log(`Załadowano ${req.url}`);
            }
            else
            {
                res.writeHead(404, {'Content-Type':'text/html'});
                console.dir(`Nie wczytano pliku ${css}`);
                res.end();
            }
        });
    }

    // script
    if(req.url === '/script.js')
    {
        fs.readFile(script, (err, data)=>{
            if(!err)
            {
                res.writeHead(200, {'Content-Type':'text/javascript; charset=utf-8'});
                res.end(`${data}`);
                console.log(`Załadowano ${req.url}`);
            }
            else
            {
                res.writeHead(404, {'Content-Type':'text/html'});
                console.dir(`Nie wczytano pliku ${script}`);
                res.end();
            }
        });
    }

    // icon
    if(req.url === '/favicon.ico')
    {
        fs.readFile(favicon, (err, data)=>{
            if(!err)
            {
                res.writeHead(200, {'Content-Type':'image/x-icon'});
                console.log(`Załadowano ${favicon}`);
                res.end(data);
            }
            else
            {
                res.writeHead(404, {'Content-Type':'text/html'});
                console.log(`Błąd - nie wczytano zasobu: ${favicon}`);
                res.end();
            }
        });
    }
}

const server = http.createServer(odpowiedz);
server.listen(port, host, () => console.log(`Serwer WWW działa. Jego adres to: ${host}:${port}`));