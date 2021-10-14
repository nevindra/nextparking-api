const express = require('express');
const app = express();
const multer = require('multer');
const helmet = require('helmet')
const fs = require("fs");
const path = require("path");
const db = require('./database/db')

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

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const {fileStorage, fileFilter} = require('./utility/multer')
const PORT = process.env.PORT;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ['*']);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
// app.use(helmet());
app.use(express.urlencoded({extended: false, limit: '50mb'}))
app.use(multer({
    storage: fileStorage, fileFilter: fileFilter
}).single('image'))

const userRoutes = require('./users/user.routes');
const vehicleRoutes = require('./vehicles/vehicle.routes');
const transactionRoutes = require('./transactions/transaction.routes');
const universityRoutes = require('./university/uni.routes')


app.use('/api/', userRoutes);
app.use('/api/', vehicleRoutes);
app.use('/api/', transactionRoutes);
app.use('/api/', universityRoutes);

const server = app.listen(process.env.PORT, err => {
    if (err) console.log(err);
    console.log(`⚡ Connected to http://localhost:${PORT} ⚡`)
});

module.exports = server
