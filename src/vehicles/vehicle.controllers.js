const logger = require('../../config/logger')

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.registerVehicle = async (req, res) => {
    const {plate_number, vehicle_type} = req.body

    try {
        await prisma.vehicles.create({
            data: {
                id_user: parseInt(req.id_user),
                plate_number: plate_number,
                vehicle_type: vehicle_type
            }
        })
        res.status(201).json({
            status: 201,
            data: {
                'id_user': req.id_user,
                'plate_number': plate_number,
                'car_type': vehicle_type
            }
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicles.findMany()
        if (!vehicles) return res.status(404).send()
        res.status(200).json({
            status: 200,
            data: vehicles
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({status: 500, message: 'Internal Server Error'});
    }
}

exports.getUserVehicles = async (req, res) => {

    try {
        const results = await prisma.vehicles.findMany({
            where:
                {id_user: parseInt(req.id_user)}
        })
        if (!results) return res.status(404).json({status: 404, message: 'Vehicles is not found'})
        res.status(200).json({
            status: 200,
            data: results
        });
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({status: 500, message: 'Internal Server Error'});
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
        if (!results) return res.status(404).send({status: 404, response: 'Vehicle not found'})
        res.status(200).json({status: 200, data: results});
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({status: 500, message: 'Internal Server Error'});
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

        res.status(200).json({status: 200, response: 'Vehicle deleted successfully.'});
    } catch (e) {
        if (e.code === "P2025") return res.status(404).send({status: 404, message: 'Vehicle is not found'})
        res.status(500).json({status: 500, message: 'Internal Server Error'});
    }
};

exports.editVehicle = async (req, res) => {
    const {id_vehicle, plate_number, vehicle_name} = req.body

    try {
        if (plate_number && vehicle_name) {
            await prisma.vehicles.update({
                where: {
                    id_vehicle: parseInt(id_vehicle)
                },
                data: {
                    plate_number: plate_number,
                    vehicle_name: vehicle_name
                }
            })
        } else if (plate_number) {
            await prisma.vehicles.update({
                where: {
                    id_vehicle: parseInt(id_vehicle)
                },
                data: {
                    plate_number: plate_number
                }
            })
        } else if (vehicle_name) {
            await prisma.vehicles.update({
                where: {
                    id_vehicle: parseInt(id_vehicle)
                },
                data: {
                    vehicle_name: vehicle_name
                }
            })
        }
        const vehicle = await prisma.vehicles.findUnique({
            where: {
                id_vehicle: parseInt(id_vehicle)
            }
        })

        res.status(201).json({status: 201, data: vehicle})
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({status: 500, message: 'Internal Server Error'});
    }
}