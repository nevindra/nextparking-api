const logger = require('../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSubsPlans = async (req, res) => {
    try {
        const plans = await prisma.subs_plans.findMany()
        res.status(200).send(plans)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}

exports.getSinglePlan = async (req, res) => {
    const {id_subs} = req.params
    try {
        const plan = await prisma.subs_plans.find({where: {id_subs: parseInt(id_subs)}})
        res.status(200).send(plan)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}

exports.getSubsPaymentHistory = async (req, res) => {
    /*
    * this controllers used for get all payment history for subscriptions
    * */
    const {id_user} = req.params
    try {
        const subs = await prisma.subs_transactions.findMany({where: {id_user: parseInt(id_user)}})
        res.status(200).send(subs)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

exports.getSubSingleHistory = async (req, res) => {
    const {id_subs} = req.params;
    try {
        const sub = await prisma.subs_transactions.findUnique({where: {id_subs: parseInt(id_subs)}})
        res.status(200).send(sub)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}