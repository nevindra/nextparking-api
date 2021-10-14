const client = require('../database/db')

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

module.exports = db