const logger = require('../../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.bookParking = async (req, res) => {
    const {id_quota, id_user, id_place, id_vehicle, time_booking} = req.body

    try {
        const quota = await prisma.quotas.findUnique({where: {id_quota: parseInt(id_quota)}})
        const vehicle = await prisma.vehicles.findUnique({where: {id_vehicle: parseInt(id_vehicle)}})

        if (quota.vehicle_type !== vehicle.vehicle_type) {
            return res.status(409).send({error: 'use the correct subscription plan!'})
        }

        if (quota.amount === 0) {
            return res.status(409).send({error: 'quota is 0'})
        }
        
        await prisma.bookings.create({
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
        const bookings = await prisma.bookings.findMany({where: {id_user: parseInt(id_user)}})
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
        const book = await prisma.bookings.findUnique({where: {id_booking: parseInt(id_booking)}})
        res.status(200).send(book)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.deleteBooking = async (req, res) => {
    const {id_booking} = req.params

    try {
        await prisma.bookings.delete({where: {id_booking: parseInt(id_booking)}})
        res.status(200).send({
            response: 'Deleted'
        })
    } catch (e) {
        if (e.code === "P2025") res.status(404).send({response: 'not found.'})
        logger.error(e)
        res.status(500).send();
    }
}