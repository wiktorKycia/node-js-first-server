// methods' declaration
const http = require('http')
const path = require('path')
const fs = require('fs')

// server's address
const host = '127.0.0.1';
const port = 5555;



class MessageLogger
{
    constructor(route) {
        this.route = route;
    }
    logMessage(message)
    {
        console.log(`${this.route} ${new Date().toLocaleTimeString()} ${message}`);
    }
    logError(err)
    {
        console.log('\x1b[31m %s \x1b[0m', `${this.route} ${new Date().toLocaleTimeString()} ${err}`);
    }
}

function buildHeaders(res, code, contentType, charset='')
{
    if(charset !== '')
    {
        res.writeHead(code, {'Content-Type' : `${contentType}; charset=${charset}`});
    }
    else
    {
        res.writeHead(code, {'Content-Type' : `${contentType}`});
    }
}

class DefaultDataSender
{
    sendData(res, data)
    {
        res.end(`${data}`);
    }
    sendError(res)
    {
        res.end();
    }
}
class HTMLDataSender
{
    constructor(htmlErrorCode) {
        this.html = htmlErrorCode;
    }
    sendData(res, data)
    {
        res.end(`${data}`);
    }
    sendError(res)
    {
        res.end(this.html);
    }
}

class Plik
{
    constructor(
        path, url,
        messageLogger,
        headerBuilder,
        dataSender,
        contentType,
        charset='')
    {
        this.path = path;
        this.url = url;
        this.messageLogger = new messageLogger(url);
        this.headerBuilder = headerBuilder;
        this.dataSender = dataSender;
        this.content = contentType;
        this.charset = charset;
    }
    load(req, res)
    {
        fs.readFile(this.path, (err, data)=>{
            if(!err)
            {
                this.headerBuilder(res, 200, this.content, this.charset);
                this.dataSender.sendData(res, data);
                this.messageLogger.logMessage(`Załadowano ${req.url}`);
            }
            else
            {
                this.headerBuilder(res, 404, 'text/html');
                this.messageLogger.logError(`Nie wczytano pliku ${this.path}`);
                this.dataSender.sendError(res);
            }
        })
    }
}

class Serwer
{
    constructor(files) {
        this.files = [...files];
    }
    render(req, res)
    {
        for (const file of this.files) {
            if(file.url === req.url)
            {
                file.load(req, res);
            }
        }
    }
}
defaultDataSender = new DefaultDataSender();
htmlDataSender = new HTMLDataSender(`<h3>Strona o podanym adresie nie istnieje</h3>`);


const files = [
    new Plik(
        path.join(__dirname, '/index.html'),
        '/',
        MessageLogger,
        buildHeaders,
        htmlDataSender,
        'text/html',
        'utf-8'
    ),
    new Plik(
        path.join(__dirname, '/style.css'),
        '/style.css',
        MessageLogger,
        buildHeaders,
        defaultDataSender,
        'text/css',
        'utf-8'
    ),
    new Plik(
        path.join(__dirname, '/script.js'),
        '/script.js',
        MessageLogger,
        buildHeaders,
        defaultDataSender,
        'text/javascript',
        'utf-8'
    ),
    new Plik(
        path.join(__dirname, '/favicon.ico'),
        '/favicon.ico',
        MessageLogger,
        buildHeaders,
        defaultDataSender,
        'image/x-icon'
    )
];


const s1 = new Serwer(files);

const server = http.createServer((req, res) => s1.render(req, res));
server.listen(port, host, () => console.log(`server avaiable at: ${host}:${port}`));