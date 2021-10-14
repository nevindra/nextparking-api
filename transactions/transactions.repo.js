const client = require('../database/db')
const repoUser = require("../users/user.repo");
const bcrypt = require("bcrypt");

let db = {}

db.verification = async (id_user, verification_pin) => {
    const user = await repoUser.findUserByID(id_user)
    if (!user) return false
    // do pin checking before continue
    let verification_pin_user = user.verification_pin
    const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
    return !!isAuth;
}

db.getQuotas = async (id_user) => {
    const result = await client.query('SELECT * FROM uni_quotas WHERE id_user = $1', [id_user])
    return result.rows[0]
}


db.payTransaction = async (id_user, amount) => {
    // get last transaction and update it to done
    await client.query(
        'UPDATE uni_quotas SET amount = $2 WHERE id_user = $1', [id_user, amount]
    );
    await client.query('UPDATE uni_parking_transactions SET is_done = true WHERE id_user = $1', [id_user])
}

db.getSubsPaymentHistory = async (id_user) => {
    return await client.query('SELECT * FROM user_uni_subscriptions WHERE id_user = $1', [id_user])
}

module.exports = db