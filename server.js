const http = require('http');
const fileSystem = require('fs');
const url = require('url');
const path = require('path');

const PORT = 9000;

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
    const parsedUrl = url.parse(req.url, true);
    let {pathname} = parsedUrl;

    // =========== check if the pathname starts with the base url =======
    if(!pathname.startsWith(baseUrl)){
        return sendResponse(res, 404, {success: false, message: 'Invalid base Url'});
    }
});

// =========== start the server ================
ser.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});