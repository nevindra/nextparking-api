const repo = require('./vehicle.repo')
const logger = require('../config/logger')
exports.registerVehicle = async (req, res) => {
    const {id_user, plate_number, car_type} = req.body
    // const image = req.file;
    // const imageUrl = image.path;

    try {
        await repo.registerVehicle(id_user, plate_number, car_type)
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
        const vehicles = await repo.getAllVehicles()
        console.log(vehicles)
        if (vehicles.rows === undefined) return res.status(404).send()
        res.status(200).send(vehicles.rows)
    } catch (e) {
        logger.error(e);
        res.status(500).send(e);
    }
}

exports.getUserVehicles = async (req, res) => {
    const {id_user} = req.params
    try {
        const results = await repo.getUserVehicles(id_user)
        console.log(results)
        if (results.rows === undefined) return res.status(404).send()
        res.status(200).send(results);
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
};

exports.getSingleVehicle = async (req, res) => {
    const {id_user, id_vehicle} = req.params
    try {
        const results = await repo.getSingleVehicle(id_user, id_vehicle)
        if (typeof results === 'undefined') return res.status(400).send({'response': 'Vehicle not found.'})
        res.status(200).send(results);
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
};

exports.deleteVehicleById = async (req, res) => {
    const {id_user, id_vehicle} = req.body
    console.log(id_user);
    console.log(id_vehicle);
    try {
        const result = await repo.getSingleVehicle(id_user, id_vehicle)
        if (typeof result === 'undefined') {
            return res.status(404).send({
                "id_user": id_user,
                "id_vehicle": id_vehicle
            });
        }
        await repo.deleteVehicleById(id_user, id_vehicle)

        res.status(200).send({"response": 'success'});
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
};