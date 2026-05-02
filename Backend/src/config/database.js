const mongoose = require('mongoose');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

module.exports = connectToDb;