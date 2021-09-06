const client = require('../database/database')
const repoUser = require("../users/user.repo");
const bcrypt = require("bcrypt");

let db = {}

db.verification = async (id_user, verification_pin) => {
    const user = await repoUser.findUserByID(id_user)
    if (typeof user.rows[0] === 'undefined') return res.status(404).send({'response': 'user not found'});
    // do pin checking before continue
    let verification_pin_user = user.rows[0].verification_pin
    const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
    return !!isAuth;
}

db.getAllTransactionPrice = async (id_user) => {
    return await client.query(
        'SELECT id_user, SUM(price) as total FROM parking_transactions WHERE id_user = $1 AND "isDone" = false GROUP BY id_user', [id_user]
    );
}

db.payTransaction = async (id_user) => {
    // get last transaction and update it to done
    await client.query(
        'UPDATE parking_transactions SET "isDone" = true WHERE id_user = $1 AND id_transaction\n' +
        '                IN (\n' +
        '                    SELECT id_transaction\n' +
        '                    FROM parking_transactions\n' +
        '                    WHERE id_user = $1 AND "isDone" = false\n' +
        '                    ORDER BY id_transaction desc\n' +
        '                    LIMIT 1)', [id_user]
    );
}

db.updateBalance = async (id_user, saldo) => {
    await client.query(
        'UPDATE users SET balance = $1 WHERE id_user = $2', [saldo, id_user]
    );
}

db.getAllTransaction = async (id_user, status) => {
    return await client.query('SELECT * FROM parking_transactions WHERE id_user = $1 AND parking_transactions."isDone" = $2 ', [id_user, status]);
}

module.exports = db