const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/task';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully!');
});

module.exports = db;