const logger = require('../../config/logger')
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllParkingTransactions = async (req, res) => {
    /*
    * This part is to get all university parking transactions
    * either it's already paid or still active transactions
    * */
    const {status} = req.body
    try {
        const result = await prisma.$queryRaw`
    SELECT id_parking, address, time_in, plate_number, name as university FROM parkings_transactions pt
    JOIN vehicles v on pt.id_vehicle = v.id_vehicle
    JOIN universities u on pt.id_place = u.id_place
    WHERE pt.id_user = 146 AND pt.is_done = ${status}`
        if (result.length > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Successfully fetched all parking transactions',
                data: result
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'No parking transactions found'
            })
        }
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.getSingleParkingTransactions = async (req, res) => {
    /*
    * This part is to get single ACTIVE parking transaction
    * */
    const {id_parking} = req.params
    try {
        const transaction = await prisma.$queryRaw`
    SELECT id_parking, plate_number, time_in, time_out, name as university , address FROM parkings_transactions pt
    JOIN vehicles v on pt.id_vehicle = v.id_vehicle
    JOIN universities u on pt.id_place = u.id_place
    WHERE pt.id_parking = ${parseInt(id_parking)}`
        if (transaction.length > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Successfully get single transaction',
                data: transaction[0]
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'Transaction not found'
            })
        }
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.payParking = async (req, res) => {
    /*
    * in this part user will pay transaction with quota they have.
    * first we will check update transactions status
    * second we'll update user quotas
    * */
    const {id_quota, id_parking} = req.body;
    try {
        const parking = await prisma.$queryRaw`select id_parking, vehicle_type, pt.id_vehicle, pt.id_place from parkings_transactions as pt
        join vehicles v on v.id_vehicle = pt.id_vehicle
        where id_parking = ${id_parking}`

        const place = await prisma.universities.findUnique({
            where: {
                id_place: parseInt(parking[0].id_place)
            }
        })
        await prisma.parkings_transactions.update({
            where: {
                id_parking: parseInt(id_parking)
            },
            data: {
                is_done: true
            }
        })

        await prisma.quotas.update({
            where: {
                id_quota: parseInt(id_quota),
                vehicle_type: parking.vehicle_type
            },
            data: {
                amount: {
                    decrement: 1
                }
            }
        })

        await prisma.vehicles.update({
            where: {
                id_vehicle: parking[0].id_vehicle
            },
            data: {
                last_parking: place.name
            }
        })

        res.status(200).json({
            status: 200,
            message: "Transaction successfully paid"
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

