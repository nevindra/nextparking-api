const multer = require('multer')
const fs = require("fs");
const path = require("path");

exports.fileStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './images')
        },
        filename: function (req, file, cb) {
            cb(null, req.body.plate_number + "_" + req.body.id_user + "_" + req.body.car_type + "." + file.originalname.split(".")[1])
        }
    }
);

exports.fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}