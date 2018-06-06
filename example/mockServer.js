require("amd-loader");
function generateData() {
	let firstPart = (Math.random() * 46656) | 0,
		secondPart = (Math.random() * 46656) | 0;
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	return firstPart + secondPart;
}

function getTestHtml() {
	const fs = require('fs');
	if (fs.existsSync('rgridTestPage.html')) {
		return fs.readFileSync("rgridTestPage.html", "utf8");
	} else {
		if (fs.existsSync('node_modules/rgrid/example/testPage.html')) {
		    return fs.readFileSync("node_modules/rgrid/example/testPage.html", "utf8");
		} else {
			throw new Error('Test template is missing');
		}
	}
}
function getDatastoreData() {
	let dataStoreData = [];
	for (let i = 1; i < 51; i++) {
		dataStoreData.push({id: i, name: generateData(), value: generateData() + generateData()});
	}
	return dataStoreData;
}

const http = require('http'),
	jsArray = require('../rollun-rql/js-array'),
	dataStoreData = getDatastoreData(),
	server = http.createServer((request, response) => {
		request.on('error', (err) => {
			console.error(err);
			response.statusCode = 500;
			response.end();
		});
		let responseData,
			contentType,
			responseCode,
			limit = 1;
		let {url} = request;
		console.log(url);
		if (url.search('test') !== -1) {
			contentType = 'text/html';
			responseCode = 200;
			responseData = getTestHtml();
		} else {
			if (url === '/favicon.ico') {
				url = url + '?and()';
			}
			const parts = url.split('?');
			console.log(parts);
			const rql = parts[(parts.length - 1)];
			console.log(rql);
			let dataStoreResult = jsArray.query(rql, {}, dataStoreData);
			contentType = 'application/json';
			responseCode = 200;
			responseData = JSON.stringify(dataStoreResult);
		}
		response.setHeader('Content-Type', contentType);
		if (limit) {
			response.setHeader('Content-Range', `1-${limit}/50`);
		}
		response.statusCode = responseCode;
		response.end(responseData);
	});
server.listen(8080);
console.log('Server listening on localhost:8080');