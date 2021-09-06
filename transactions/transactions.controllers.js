const client = require('../database/database');
const repoUser = require('../users/user.repo')
const repo = require('./transactions.repo')

exports.payTransaction = async (req, res) => {
    // this api will be used to pay parking transactions
    const {id_user, verification_pin} = req.body;
    try {
        const isAuth = await repo.verification(id_user, verification_pin)
        if (isAuth) {
            // get all transaction price to be calculated with current balance
            const user = await repoUser.findUserByID(id_user)
            const userTransaction = await repo.getAllTransactionPrice(id_user)
            if (typeof userTransaction.rows[0] === 'undefined') return res.status(404).send({'response': 'There are no transaction for you.'})
            // pay the transaction
            await repo.payTransaction(id_user)
            // update user balance
            const saldo = user.rows[0].balance - userTransaction.rows[0].total;
            await repo.updateBalance(id_user, saldo)
            return res.status(200).send({'response': 'Payment succeeded'});
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send()
    }
}

exports.confirmPin = async (req, res) => {
    const {id_user, verification_pin} = req.body;
    try {
        const isAuth = await repo.verification(id_user, verification_pin)
        if (isAuth) return res.status(200).send()
        res.status(401).send()
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.historyTransaction = async (req, res) => {
    const {id_user} = req.params.id
    const {status} = req.body
    try {
        const user = repo.getAllTransaction(id_user, status)
        if (typeof user.rows[0] === 'undefined') {
            return res.status(404).send();
        } else {
            res.status(200).send(user.rows);
        }

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
}

exports.topUp = async (req, res) => {
    const {id_user, amount, card_number, verification_pin} = req.body;
    /*TODO:
    *   1. Need to be fixed soon.*/

    try {
        const isAuth = await repo.verification(id_user, verification_pin)
        if (isAuth) {
            const userBalance = await repoUser.findUserByID(id_user)
            const saldo = userBalance.rows[0].balance + amount
            await repo.updateBalance(id_user, saldo)

            return res.status(200).send({'response': 'Topup succeeded'});
        }
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

