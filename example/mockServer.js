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

const http = require('http'),
	server = http.createServer((request, response) => {
		let responseData,
			contentType,
			responseCode,
			limit;
		const {url} = request;
		if (url.search('test') !== -1) {
			contentType = 'text/html';
			responseCode = 200;
			responseData = getTestHtml();
		} else {
			const limitIndex = url.search('limit'),
				selectNodeIndex = url.search('select\\(id,name\\)');
			limit = parseInt(url.slice(limitIndex + 6, limitIndex + 8)) || 15;
			if (limit > 25) {
				limit = 25;
			}
			contentType = 'application/json';

			responseCode = 200;
			let dataStoreData = [];
			for (let i = 1; i < limit + 1; i++) {
				let item = {
					id: i,
					name: generateData()
				};
				dataStoreData.push(item);
			}
			if (selectNodeIndex === -1) {
				for (let item of dataStoreData) {
					item.value = generateData() + generateData();
				}
			}
			responseData = JSON.stringify(dataStoreData);
		}
		response.setHeader('Content-Type', contentType);
		if (limit) {
			response.setHeader('Content-Range', `1-${limit}/25`);
		}
		response.statusCode = responseCode;
		response.end(responseData);
	});
server.listen(8080);
console.log('Server listening on localhost:8080');