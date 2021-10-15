const client = require('../config/db')

let db = {}

db.registerVehicle = async (id_user, plate_number, car_type) => {
    await client.query(
        'INSERT INTO user_vehicles(id_user,plate_number,car_type) VALUES($1,$2,$3)',
        [id_user, plate_number, car_type]
    )
}

db.getAllVehicles = async () => {
    console.log('e')
    return await client.query('SELECT * FROM user_vehicles')
}

db.getUserVehicles = async (id_user) => {
    // search for vehicles based on the user
    const vehicle = await client.query('SELECT * FROM user_vehicles WHERE id_user = $1', [id_user]);
    return vehicle.rows
}

db.getSingleVehicle = async (id_user, id_vehicle) => {
    const vehicle = await client.query('SELECT * FROM user_vehicles WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
    return vehicle.rows[0]
}

db.deleteVehicleById = async (id_user, id_vehicle) => {
    const vehicle = await client.query('DELETE FROM user_vehicles WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
    return vehicle.rows[0]
}

module.exports = db