const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectTOMongoDB(url) {
    return mongoose.connect(url);
}

module.exports = connectTOMongoDB;
