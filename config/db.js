const mongoose = require('mongoose');
const config = require('config')
const db = config.get("MONGO_URI")
const connectDB = async () =>{

    try {
        const conn = await mongoose.connect(db,{

            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true

        });
        console.log(` MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        return console.log('cant connect', error)
    }
};

module.exports = connectDB;