const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function initializeMongoServer() {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();

	async function tryToConnect() {
		try {
			await mongoose.connect(mongoUri);

		} catch (err) {
			if (err.message.code === "ETIMEDOUT") {
				await tryToConnect;
			}
		}
	}

	await tryToConnect();
}

async function endMongoConnection() {
	await mongoose.disconnect();
	await mongoServer.stop();
}
module.exports = { initializeMongoServer, endMongoConnection };
