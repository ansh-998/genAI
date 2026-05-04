require('dns').setDefaultResultOrder('ipv4first');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const app = require('./src/app');
const connectToDb = require('./src/config/database');
const invokeGeminiAi = require('./src/services/ai.service')

connectToDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});