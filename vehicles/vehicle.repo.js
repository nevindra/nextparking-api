const client = require('../database/database')

let db = {}

db.registerVehicle = async (id_user, plate_number, car_type, imageUrl) => {
    await client.query(
        'INSERT INTO user_vehicle(id_user,plate_number,car_type,img_stnk) VALUES($1,$2,$3,$4)',
        [id_user, plate_number, car_type, imageUrl]
    )
}

db.getAllVehicles = async () => {
    return await client.query('SELECT * FROM user_vehicle')
}

db.getUserVehicles = async (id_user) => {
    // search for vehicles based on the user
    return await client.query('SELECT * FROM user_vehicle WHERE id_user = $1', [id_user]);
}

db.getSingleVehicle = async (id_user, id_vehicle) => {
    return await client.query('SELECT * FROM user_vehicle WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
}

db.deleteVehicleById = async (id_user, id_vehicle) => {
    return await client.query('DELETE FROM user_vehicle WHERE id_user = $1 AND id_vehicle = $2', [id_user, id_vehicle]);
}

module.exports = db