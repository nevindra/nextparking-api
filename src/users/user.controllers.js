const bcrypt = require("bcrypt");
const logger = require('../../config/logger')
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});

exports.getUsers = async (req, res) => {
    try {
        const results = await prisma.users.findMany()
        return res.status(200).json({
            status: 200,
            data: results
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

exports.getUserByID = async (req, res) => {
    
    try {
        const user = await prisma.users.findUnique({
            where: {
                id_user: parseInt(req.id_user),
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            status: 200,
            data: user
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

exports.postRegistration = async (req, res) => {
    const {full_name, email, password, phone_number} = req.body;
    const saltRounds = 10;
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.users.create({
            data: {
                full_name,
                email,
                password: encryptedPassword,
                phone_number
            }
        })

        return res.status(201).json({
            status: 201,
            data: user
        });

    } catch (e) {
        if (e.code === "P2002") return res.status(409).send({
            status: 409,
            message: 'email / phone number is found'
        })
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

exports.editUser = async (req, res) => {

    const {full_name, phone_number, email} = req.body

    try {
        let user = await prisma.users.findUnique({
            where: {
                id_user: parseInt(req.id_user)
            }
        })
        if (!user) {
            return res.status(404).json({
                status: '404',
                message: "User not found"
            });
        }
        if (full_name) {
            await prisma.users.update({
                where: {
                    id_user: parseInt(req.id_user)
                },
                data: {
                    full_name: full_name
                }
            })
        } else if (phone_number) {
            await prisma.users.update({where: {id_user: parseInt(req.id_user)}, data: {phone_number}})
        } else if (email) {
            await prisma.users.update({where: {id_user: parseInt(req.id_user)}, data: {email}})
        }
        let newuser = await prisma.users.findUnique({
            where: {
                id_user: parseInt(req.id_user)
            }
        })
        res.status(200).json({
            status: 200,
            message: "User updated",
            data: {
                newuser
            }
        });
    } catch (e) {
        logger.error(e);
        console.log(e)
        res.status(400).send();
    }
};

exports.sendSMS = async (req, res) => {
    const {phone_number} = req.body
    const phone = '+62' + phone_number.substring(1);
    try {
        await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verifications
            .create({to: phone, channel: 'sms'})

        res.status(200).send({status: 200, message: 'success'})
    } catch (e) {
        logger.error(e)
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }

}

exports.verifySMS = async (req, res) => {
    const {phone_number, token} = req.body
    const phone = '+62' + phone_number.substring(1);
    try {
        const result = await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({to: phone, code: token})
        if (result.status === 'approved') {
            await prisma.users.update({where: {phone_number}, data: {activated: true}})
            res.status(200).send({status: 200, message: 'User is verified'})
        } else if (result.status === 'pending') {
            res.status(409).send({status: 409, message: 'Code is not valid'})
        }
    } catch (e) {
        console.log(e)
        logger.error(e);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}