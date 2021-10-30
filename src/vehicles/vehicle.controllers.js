const logger = require('../../config/logger')

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.registerVehicle = async (req, res) => {
    const {id_user, plate_number, car_type} = req.body

    try {
        await prisma.vehicles.create({
            id_user,
            plate_number,
            car_type
        })
        res.status(201).send({
            'response': 'succeeded',
            'data': {
                'id_user': id_user,
                'plate_number': plate_number,
                'car_type': car_type
            }
        })
    } catch (e) {
        logger.error(e);
        res.status(400).send(e);
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicles.findMany()
        if (!vehicles) return res.status(404).send()
        res.status(200).send(vehicles)
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send(e);
    }
}

exports.getUserVehicles = async (req, res) => {
    const {id_user} = req.params
    try {
        const results = await prisma.vehicles.findMany({
            where:
                {id_user: parseInt(id_user)}
        })
        if (results === undefined) return res.status(404).send()
        res.status(200).send(results);
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
};

exports.getSingleVehicle = async (req, res) => {
    const {id_vehicle} = req.params
    try {
        const results = await prisma.vehicles.findUnique({
            where: {
                id_vehicle: parseInt(id_vehicle)
            }
        })
        if (!results) return res.status(404).send({'response': 'Vehicle not found.'})
        res.status(200).send(results);
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send();
    }
};

exports.deleteVehicleById = async (req, res) => {
    const {id_vehicle} = req.body

    try {
        await prisma.vehicles.delete({
            where: {
                id_vehicle: parseInt(id_vehicle)
            }
        })

        res.status(204).send({"response": 'success'});
    } catch (e) {
        if (e.code === "P2025") return res.status(404).send({response: 'vehicle not found'})
        res.status(500).send();
    }
};