const repo = require('./uni.repo')
const {Client} = require("@googlemaps/google-maps-services-js");
const logger = require('../config/logger');

exports.getAllParkingTransactions = async (req, res) => {
    /*
    * This part is to get all university parking transactions
    * either it's already paid or still active transactions
    * */
    const id_user = req.params.id
    const {status} = req.body
    try {

        const user = await repo.getAllParkingTransactions(id_user, status)
        if (typeof user.rows === 'undefined') {
            return res.status(200).send([{}]);
        } else {
            res.status(200).send(user.rows);
        }

    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
}

exports.getSingleParkingTransactions = async (req, res) => {
    /*
    * This part is to get single ACTIVE parking transaction
    * */
    const {id_transaction} = req.params
    try {
        const transaction = await repo.getSingleParkingTransactions(id_transaction)
        res.status(200).send(transaction);
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
}

exports.payParking = async (req, res) => {
    /*
    * This part is to pay single active transaction
    * */
    const {id_user, id_transaction} = req.body

    try {

    } catch (e) {

    }
}

exports.bookParking = async (req, res) => {
    const {id_user, id_place, id_vehicle, time_booking} = req.body

    try {
        await repo.bookParking(id_user, id_place, id_vehicle, time_booking)
        res.status(201).send({
            'response': 'Booking Order Created'
        })
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.getAllBooking = async (req, res) => {
    const id_user = req.params.id_user
    try {
        const bookings = await repo.getAllBooking(id_user)
        if (bookings.rows === undefined) return res.status(404).send([])
        res.status(200).send(bookings.rows)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.getSingleBooking = async (req, res) => {
    const {id_booking} = req.params
    try {
        const book = await repo.getSingleBooking(id_booking)
        res.status(200).send(book)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.deleteBooking = async (req, res) => {
    const {id_booking} = req.params

    try {
        await repo.deleteBooking(id_booking)
        res.status(204).send({'response': 'Booking Deleted'})
    } catch (e) {
        logger.error(e)
        res.status(500).send();
    }
}

exports.getAllUniversity = async (req, res) => {
    /*
    * NOT DONE YET
    * */
    let destinations = ["Kampus D Gunadarma"]
    let origins = ["-6.538755,106.8101117"]
    const client = new Client({})

    try {
        const result = await client.distancematrix({
            params: {
                origins: origins,
                destinations: destinations,
                key: process.env.GOOGLE_API_KEY
            }
        })
        console.log(JSON.stringify(result.data.rows[0].elements))
        res.status(200).send()
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.getSingleUniversity = async (req, res) => {
    const {id_place} = req.body

    try {
        const result = repo.getSingleUniversity(id_place)
        res.status(200).send(result)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}