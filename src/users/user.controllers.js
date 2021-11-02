const bcrypt = require("bcrypt");
const logger = require('../../config/logger')
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
}

exports.getUsers = async (req, res) => {
    try {
        const results = await prisma.users.findMany()
        res.status(200).send(results);
    } catch (e) {
        logger.error(e);
        res.status(500).send();
    }
};

exports.getUserByID = async (req, res) => {
    const id_user = req.params.id;
    try {
        const user = await prisma.users.findUnique({
            where: {
                id_user: parseInt(id_user),
            }
        })
        if (!user) return res.status(404).send({'response': 'user not found'});
        res.status(200).send(user);
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
};

exports.postRegistration = async (req, res) => {
    const {full_name, email, password, phone_number} = req.body;
    const saltRounds = 10;
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        await prisma.users.create({
            data: {
                full_name,
                email,
                password: encryptedPassword,
                phone_number
            }
        })

        res.status(201).send({'response': 'succeeded'});
    } catch (e) {
        if (e.code === "P2002") return res.status(409).send({response: 'email / phone number is found'})
        logger.error(e);
        res.status(500).send(e);
    }
};

exports.loginUser = async (req, res) => {
    const {email, password, device_token} = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        })

        if (!user) return res.status(404).send({'response': 'user not found'});
        if (!user.activated) return res.status(409).send({response: 'activate the account'})
        const isAuth = await bcrypt.compareSync(password, user.password);
        if (isAuth) {
            const date = new Date()
            const currentDate = convertTZ(date, "Asia/Jakarta")
            await prisma.users.update({where: {email}, data: {device_token, last_login: currentDate}})
            res.status(200).send(user);
        } else {
            return res.status(401).send({'response': 'wrong password'});
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).send();
    }
};

exports.deleteUser = async (req, res) => {
    const id_user = req.params.id
    try {
        await prisma.users.delete({where: {id_user: parseInt(id_user)}})
        res.send({
            'response': `User deleted with ID: ${id_user}`
        })
    } catch (e) {
        logger.error(e);
        if (e.code === "P2025") return res.status(404).send({response: 'User not found'})
        res.status(500).send();
    }
};

// exports.editUser = async (req, res) => {
//     const id_user = req.params.id
//     const {full_name, phone_number} = req.body
//     let user;
//     try {
//         if (!full_name) {
//             user = await repo.updatePhoneNumber(id_user, phone_number)
//         } else if (!phone_number) {
//             user = await repo.updateFullName(id_user, full_name)
//         }
//
//         if (!user) return res.status(404).send();
//
//         res.send(`Updated user with ID: ${id_user}`)
//     } catch (e) {
//         logger.error(e);
//         res.status(400).send();
//     }
// };

exports.sendSMS = async (req, res) => {
    const {phone_number} = req.body
    const phone = '+62' + phone_number.substring(1);
    try {
        await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verifications
            .create({to: phone, channel: 'sms'})

        res.status(200).send({response: 'success'})
    } catch (e) {
        logger.error(e)
        res.send(500).send({response: 'internal server error'})
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
            res.status(200).send({response: 'success'})
        } else if (result.status === 'pending') {
            res.status(409).send({response: 'wrong pin'})
        }
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).send({response: 'internal server error'});
    }
}