const client = require('../config/db')

let db = {}

db.findUsers = async () => {
    return await client.query('SELECT * FROM users ORDERS BY id_user')
}

db.findUserByEmail = async (email) => {
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email])
    return user.rows
}

db.findUserByID = async (id_user) => {
    const user = await client.query('SELECT * FROM users WHERE id_user = $1', [id_user])
    return user.rows[0]
}

db.registerUser = async (full_name, email, encryptedPassword, phone_number, encryptedVerification) => {
    await client.query(
        'INSERT INTO users(full_name,email,password,phone_number,verification_pin) VALUES($1,$2,$3,$4,$5)',
        [full_name, email, encryptedPassword, phone_number, encryptedVerification]
    );
}

db.updateDeviceToken = async (id_user, device_token) => {
    await client.query('UPDATE users SET device_token = $2 WHERE id_user = $1', [id_user, device_token])
}

db.deleteUser = async (id_user) => {
    return await client.query('DELETE FROM users WHERE id_user = $1', [id_user])
}

db.updateFullName = async (id_user, full_name) => {
    return await client.query('UPDATE users SET full_name = $1 WHERE id_user = $1', [full_name, id_user])
}

db.updatePhoneNumber = async (id_user, phone_number) => {
    return await client.query('UPDATE users SET phone_number = $1 WHERE id_user = $2', [phone_number, id_user])
}

module.exports = db