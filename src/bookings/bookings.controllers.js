const logger = require('../../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.bookParking = async (req, res) => {
    const {id_user, id_place, id_vehicle, time_booking} = req.body

    try {
        // if time booking is more than 3 hours from current time, return error
        const currentTime = new Date();
        const bookingTime = new Date(time_booking);
        const diff = bookingTime.getTime() - currentTime.getTime();
        const diffHours = diff / (1000 * 3600);
        if (diffHours > 3) {
            return res.status(400).json({
                status: 400,
                message: 'Time booking is more than 3 hours from current time'
            })
        }

        await prisma.bookings.create({
            data: {
                id_user: parseInt(id_user),
                id_place: parseInt(id_place),
                id_vehicle: id_vehicle,
                time_booking: time_booking
            }
        })
        res.status(201).json({
            status: 201,
            message: 'Booking created'
        })
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        })
    }
}

exports.getAllBooking = async (req, res) => {
    try {
        const bookings = await prisma.bookings.findMany({where: {id_user: parseInt(req.id_user)}})
        res.status(200).json({
            status: 200,
            data: bookings
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        })
    }
}

exports.getSingleBooking = async (req, res) => {
    const {id_booking} = req.params
    try {
        const book = await prisma.bookings.findUnique({where: {id_booking: parseInt(id_booking)}})
        res.status(200).json({
            status: 200,
            data: book
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        })
    }
}

exports.deleteBooking = async (req, res) => {
    const {id_booking} = req.params

    try {
        await prisma.bookings.delete({where: {id_booking: parseInt(id_booking)}})
        res.status(200).json({
            status: 200,
            message: 'Booking deleted'
        })
    } catch (e) {
        if (e.code === "P2025") res.status(404).send({response: 'not found.'})
        logger.error(e)
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        })
    }
}