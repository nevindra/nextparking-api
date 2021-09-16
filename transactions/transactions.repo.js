const client = require('../database/database')
const repoUser = require("../users/user.repo");
const bcrypt = require("bcrypt");

let db = {}

db.verification = async (id_user, verification_pin) => {
    const user = await repoUser.findUserByID(id_user)
    if (typeof user === 'undefined') return false
    // do pin checking before continue
    let verification_pin_user = user.verification_pin
    const isAuth = await bcrypt.compareSync(verification_pin, verification_pin_user);
    return !!isAuth;
}

db.getAllTransactionPrice = async (id_user) => {
    return await client.query(
        'SELECT id_user, SUM(price) as total FROM parking_transactions WHERE id_user = $1 GROUP BY id_user', [id_user]
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

db.updateBalance = async (id_user, amount, payment_method) => {
    // user enter amount -> saved to database -> get sum of all recharge amount -> insert into users
    function convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
    }

    const date = new Date()
    const currentDate = convertTZ(date, "Asia/Jakarta")
    await client.query(
        'INSERT INTO user_topup(id_user, amount, payment_method, created) VALUES ($1, $2, $3,$4)', [id_user, amount, payment_method, currentDate]
    )

    const currentBalance = await client.query('SELECT id_user, SUM(amount) FROM user_topup WHERE id_user = $1 GROUP BY id_user', [id_user])

    await client.query(
        'UPDATE users SET balance = $1 WHERE id_user = $2', [currentBalance.rows[0].sum, id_user]
    );
}

db.getHistoryParking = async (id_user, status) => {
    return await client.query('SELECT * FROM parking_transactions WHERE id_user = $1 AND parking_transactions."isDone" = $2 ', [id_user, status]);
}

db.getAllTopUpTransaction = async (id_user) => {
    return await client.query('SELECT * FROM user_topup WHERE id_user = $1', [id_user])
}

module.exports = db