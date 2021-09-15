const repo = require('./vehicle.repo')

exports.registerVehicle = async (req, res) => {
    /* TODO:
    *   1. Add vehicle image to Google Cloud Storage
    * */
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
        console.log(e)
        res.status(400).send(e);
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await repo.getAllVehicles()
        res.status(200).send(vehicles.rows)
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
}

exports.getUserVehicles = async (req, res) => {
    const {id_user} = req.params
    try {
        const results = await repo.getUserVehicles(id_user)
        res.send(results);
    } catch (e) {
        console.log(e);
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
        console.log(e);
        res.status(500).send();
    }
};

exports.deleteVehicleById = async (req, res) => {
    const {id_user, id_vehicle} = req.body

    try {
        const result = repo.deleteVehicleById(id_user, id_vehicle)
        if (typeof result === 'undefined') {
            res.status(404).send();
        }

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};