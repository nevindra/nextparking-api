const client = require('../config/db')

let db = {}

db.getAllParkingTransactions = async (id_user, status) => {
    return await client.query(
        'SELECT * FROM uni_parking_transactions WHERE id_user = $1 AND is_done = $2', [id_user, status]
    );
}

db.getSingleParkingTransactions = async (id_transaction) => {
    const result = await client.query(
        'SELECT * FROM uni_parking_transactions WHERE id_transaction = $1', [id_transaction]
    );

    return result.rows[0]
}

db.getSingleUniversity = async (id_place) => {
    const result = await client.query(
        'SELECT * FROM places WHERE id_place = $1', [id_place]
    );

    return result.rows[0]
}

db.bookParking = async (id_user, id_place, id_vehicle, time_booking) => {
    return await client.query('INSERT INTO bookings(id_user, id_place, id_vehicle, time_booking) VALUES ($1,$2,$3,$4)',
        [id_user, id_place, id_vehicle, time_booking])
}

db.getAllBooking = async (id_user) => {
    return await client.query('SELECT * FROM bookings WHERE id_user = $1 AND is_done = false', id_user)
}

db.deleteBooking = async (id_booking) => {
    return await client.query('DELETE FROM bookings WHERE id_booking = $1', [id_booking])
}

db.getSingleBooking = async (id_booking) => {
    const book = await client.query('SELECT * FROM bookings WHERE id_booking = $1', [id_booking])

    return book.rows[0]
}
module.exports = db