const {Client} = require("@googlemaps/google-maps-services-js");
const logger = require('../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSubsPaymentHistory = async (req, res) => {
    /*
    * this controllers used for get all payment history for subscriptions
    * */
    const {id_user} = req.params
    try {
        const user = await prisma.uni_subscriptions.findMany({where: {id_user: parseInt(id_user)}})
        res.status(200).send(user.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

exports.getAllParkingTransactions = async (req, res) => {
    /*
    * This part is to get all university parking transactions
    * either it's already paid or still active transactions
    * */
    const id_user = req.params.id_user
    const {status} = req.body
    try {
        const transactions = await prisma.uni_parkings.findMany({
            where: {
                id_user: parseInt(id_user),
                is_done: status
            }
        })
        res.status(200).send(transactions);
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send();
    }
}

exports.getSingleParkingTransactions = async (req, res) => {
    /*
    * This part is to get single ACTIVE parking transaction
    * */
    const {id_parking} = req.params
    try {
        const transaction = await prisma.uni_parkings.findUnique({where: {id_parking: parseInt(id_parking)}})
        res.status(200).send(transaction);
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send();
    }
}

exports.payParking = async (req, res) => {
    /*
    * in this part user will pay transaction with quota they have.
    * first we will check update transactions status
    * second we'll update user quotas
    * */
    const {id_user, id_parking} = req.body;
    try {
        await prisma.uni_parkings.update({
            where: {
                id_parking: parseInt(id_parking)
            },
            data: {
                is_done: true
            }
        })

        await prisma.uni_quotas.update({
            where: {
                id_user: parseInt(id_user)
            },
            data: {
                amount: {
                    decrement: 1
                }
            }
        })
        res.status(200).send({response: 'done'})
    } catch (e) {
        console.log(e)
        return res.status(500).send()
    }
}

// BOOKING SECTION:

exports.bookParking = async (req, res) => {
    const {id_user, id_place, id_vehicle, time_booking} = req.body

    try {
        const quota = await prisma.uni_quotas.findUnique({where: {id_user: parseInt(id_user)}})
        if (quota.amount === 0) {
            return res.status(409).send({error: 'quota is 0'})
        }
        await prisma.uni_bookings.create({
            data: {
                id_user: parseInt(id_user),
                id_place: parseInt(id_place),
                id_vehicle: id_vehicle,
                time_booking: time_booking
            }
        })
        res.status(201).send({
            response: 'Booking Order Created'
        })
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send()
    }
}

exports.getAllBooking = async (req, res) => {
    const id_user = req.params.id_user
    try {
        const bookings = await prisma.uni_bookings.findMany({where: {id_user: parseInt(id_user)}})
        res.status(200).send(bookings)
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send()
    }
}

exports.getSingleBooking = async (req, res) => {
    const {id_booking} = req.params
    try {
        const book = await prisma.uni_bookings.findUnique({where: {id_booking: parseInt(id_booking)}})
        res.status(200).send(book)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.deleteBooking = async (req, res) => {
    const {id_booking} = req.params

    try {
        await prisma.uni_bookings.delete({where: {id_booking: parseInt(id_booking)}})
        res.status(200).send({
            response: 'Deleted'
        })
    } catch (e) {
        if (e.code === "P2025") res.status(404).send({response: 'not found.'})
        logger.error(e)
        res.status(500).send();
    }
}

exports.getAllUniversity = async (req, res) => {
    const universities = await prisma.universities.findMany();
    let destinations = [];

    for (let uni of universities) {
        destinations.push(uni.address)
    }

    let origins = ["-6.538755,106.8101117"];

    const client = new Client({});
    try {
        const results = await client.distancematrix({
            params: {
                origins: origins,
                destinations: destinations,
                key: process.env.GOOGLE_API_KEY
            }
        })
        let locations = results.data.rows[0].elements
        let sorted = locations.sort((a, b) => a.distance.value - b.distance.value);
        res.status(200).send(sorted)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.getSingleUniversity = async (req, res) => {
    const {id_place} = req.body

    try {
        const result = await prisma.universities.findUnique({where: {id_place: parseInt(id_place)}})
        res.status(200).send(result)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}