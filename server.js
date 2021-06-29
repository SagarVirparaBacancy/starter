const express = require('express');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan');

// create express app
const app = express();
app.use(cors());
app.use(morgan('tiny'))

app.use(express.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(express.json())

// .env config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome" });
});

// importing routes
require('./app/routes/user.routes')(app);

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
