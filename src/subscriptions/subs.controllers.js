const logger = require('../../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSubsPlans = async (req, res) => {
    try {
        const plans = await prisma.subs_plan.findMany()
        if (plans) {
            res.status(200).json({
                status: 200,
                message: 'Subscription plans fetched successfully',
                data: plans
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No subscription plans found',
                data: []
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}

exports.getSinglePlan = async (req, res) => {
    const {id_subs} = req.params
    try {
        const plan = await prisma.subs_plan.findUnique({where: {id_subs: parseInt(id_subs)}})
        if (plan) {
            res.status(200).json({
                status: 200,
                message: 'Subscription plan fetched successfully',
                data: plan
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No subscription plan found',
                data: []
            })
        }
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
        if (!subs) {
            res.status(404).send({
                status: 404,
                message: 'No payment history found',
                data: []
            })
        } else {
            res.status(200).send({
                status: 200,
                message: 'Payment history fetched successfully',
                data: subs
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: 500,
            message: 'Internal server error'
        })

    }
}

exports.getSubSingleHistory = async (req, res) => {
    const {id_subs} = req.params;
    try {
        const sub = await prisma.subs_transactions.findUnique({where: {id_subs: parseInt(id_subs)}})
        if (sub) {
            res.status(200).json({
                status: 200,
                message: 'Subscription payment history fetched successfully',
                data: sub
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'No subscription payment history found',
                data: []
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({
            status: 500,
            message: "Internal server error"
        })
    }
}