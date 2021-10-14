const repo = require('./transactions.repo')

exports.payTransaction = async (req, res) => {
    // this api will be used to pay parking transactions
    const {id_user, verification_pin} = req.body;
    /*
    * TODO:
    *  1. Need to be rechecked
    * */
    try {
        const isAuth = await repo.verification(id_user, verification_pin)
        if (isAuth) {
            const id_quota = await repo.getQuotas(id_user)
            let amount = id_quota.amount - 1
            await repo.payTransaction(id_user, amount)
            return res.status(200).send({'response': 'Payment succeeded'});
        } else {
            res.status(404).send({'response': 'user not found'});
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
        if (isAuth) return res.status(200).send({'response': 'Pin confirmation succeeded'})
        res.status(401).send()
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.getSubsPaymentHistory = async (req, res) => {
    const {id_user} = req.params
    console.log(id_user);
    try {
        const user = await repo.getSubsPaymentHistory(id_user)
        if (user.rows === undefined) return res.status(404).send([])
        res.status(200).send(user.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}