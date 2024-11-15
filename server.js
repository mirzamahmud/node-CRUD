const http = require('http');
const fileSystem = require('fs');
const url = require('url');
const path = require('path');

const PORT = 9000;
const HOST = '192.168.0.112';

const dataFilePath = path.join(__dirname, './data/data.json');

// ========== define the base URL ===============
const baseUrl = '/api';

// ============ helper function to read data from JSON file ===========
const readData = () => {
    try{
        const data = fileSystem.readFileSync(dataFilePath, 'utf-8'); // Synchronously reads the entire contents of a file.
        return JSON.parse(data);
    }catch(error){
        return [];
    }
};

// ============ helper function to write data to JSON file ==========
const writeData = (data) => {
    fileSystem.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// ============ helper function to send JSON file ============
const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
};

// ========== start server ============
const server = http.createServer((req, res) => {
    console.log(req.url);
    const parsedUrl = url.parse(req.url, true);
    let {pathname} = parsedUrl;

    // =========== check if the pathname starts with the base url =======
    if(!pathname.startsWith(baseUrl)){
        return sendResponse(res, 404, {success: false, message: 'Invalid base Url'});
    }

    // =========== remove the base url prefix =============
    pathname = pathname.replace(baseUrl, '');

    // =========== Read: GET request ============
    if(req.method === 'GET' && pathname === '/items'){
        const items = readData();
        sendResponse(res, 200, {statusCode: 200, success: true, result: items});
    } else if(req.method === 'GET' && pathname.startsWith('/items/')){
        const items = readData();
        const id = parseInt(pathname.split('/')[2]);
        const item = items.find(i => i.id === id);
        if(item){
            sendResponse(res, 200, {statusCode: 200, success: true, result: item, message: 'Item found.'});
        }else{
            sendResponse(res, 404, {statusCode: 404, success: false, result: {}, message: 'Item not found.'})
        }

        /// ========== Create: post request =============
    }else if(req.method === 'POST' && pathname === '/items'){
        let body = '';
        req.on('data', chunk => {body += chunk.toString();});
        req.on('end', () => {
            const {name, description} = JSON.parse(body);
            if(name && description){
                const items = readData();
                const newItem = {
                    id: items.length ? items[items.length - 1].id + 1 : 1, 
                    name, 
                    description
                };
                items.push(newItem);
                writeData(items);
                sendResponse(res, 201, {statusCode: 201, success: true, result: newItem, message: 'Item created successfully'});
            }else{
                sendResponse(res, 400, {statusCode: 400, success: false, result: {}, message: 'Name and description are required'});
            }
        });
    }
});

// =========== start the server ================
server.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});