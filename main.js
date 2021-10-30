const express = require('express');
const app = express();
const multer = require('multer');
const fs = require("fs");
const path = require("path");
const logger = require('./config/logger')
const client = require("./config/db");

require('dotenv').config()

const {fileStorage, fileFilter} = require('./utility/multer')

if (process.env.NODE_ENV === 'deployment') {
    if (!fs.existsSync('./images')) {
        fs.mkdir(
            path.join(__dirname, 'images'), (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            })
    }

}
const PORT = process.env.PORT;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ['*']);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '50mb'}))
app.use(multer({
    storage: fileStorage, fileFilter: fileFilter
}).single('image'))

const userRoutes = require('./users/user.routes');
const vehicleRoutes = require('./vehicles/vehicle.routes');
const universityRoutes = require('./university/uni.routes');
const parkingRoutes = require('./parkings/parkings.routes');
const bookingRoutes = require('./bookings/bookings.routes');
const subRoutes = require('./subscriptions/subs.routes')

app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/uni', universityRoutes);
app.use('/api/parkings', parkingRoutes);
app.use('/api/bookings', bookingRoutes)
app.use('/api/subs', subRoutes)

client.connect().then(_ => {
    logger.info(`⚡ Connected to Database ⚡`)
}).catch(e => logger.error(e));

const server = app.listen(process.env.PORT, err => {
    if (err) logger.error(err);
    logger.info(`⚡ Connected to http://localhost:${PORT} ⚡`)
});

module.exports = server
