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
    const id_user = req.params.id;
    console.log(id_user);
    try {
        const user = await prisma.users.findUnique({
            where: {
                id_user: parseInt(id_user),
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

        await prisma.users.create({
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

exports.loginUser = async (req, res) => {
    const {email, password, device_token} = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!user.activated) {
            return res.status(403).json({
                message: "User is not activated"
            });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }
        const date = new Date()
        const currentDate = convertTZ(date, "Asia/Jakarta")
        await prisma.users.update({where: {email}, data: {device_token, last_login: currentDate}})
        return res.status(200).json({
            status: 200,
            data: {
                user
            }
        });
    } catch (e) {
        logger.error(e);
        console.log(e)
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
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
        if (e.code === "P2025") return res.status(404).send({status: 404, message: 'User not found'})
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
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