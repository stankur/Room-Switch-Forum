const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

async function initializeMongoServer() {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();

	async function tryToConnect() {
		try {
			await mongoose.connect(mongoUri);

			console.log(`MongoDB successfully connected to ${mongoUri}`);
		} catch (err) {
			if (err.message.code === "ETIMEDOUT") {
				console.log(err);
				await tryToConnect;
			}
			console.log(err);
		}
	}

	await tryToConnect();
}

async function endMongoConnection() {
	await mongoose.disconnect();
	console.log("mongoose disconnected");
	await mongoServer.stop();
	console.log("mongo server stopped");
}
module.exports = { initializeMongoServer, endMongoConnection };
