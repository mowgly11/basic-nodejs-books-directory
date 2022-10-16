const mongoose = require('mongoose');
const config = require('./config.json');

module.exports = {
    init: function () {
        mongoose.connect(config.mongoDbUrl);

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB")
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Disonnected from MongoDB")
        });

        mongoose.connection.on("error", (error) => {
            console.error(error);
        });
    }
}