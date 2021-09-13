const bcrypt = require("bcrypt");
const repo = require('./user.repo')
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

exports.getUsers = async (req, res) => {
    try {
        const results = await repo.findUsers()
        res.status(200).send(results.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

exports.getUserByID = async (req, res) => {
    const id_user = req.params.id;
    try {
        const user = await repo.findUserByID(id_user)
        if (typeof user === 'undefined') return res.status(404).send({'response': 'user not found'});
        res.status(200).send(user);
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
};

exports.postRegistration = async (req, res) => {
    const {full_name, email, password, phone_number, verification_pin} = req.body;
    const saltRounds = 12;
    try {
        const checkUser = await repo.findUserByEmail(email)
        if (checkUser) return res.status(409)
            .send({'response': 'user found. cant make double account for the same person'})
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
        const encryptedVerification = bcrypt.hashSync(verification_pin, salt);

        await repo.registerUser(full_name, email, encryptedPassword, phone_number, encryptedVerification)
        return res.status(201).send({'response': 'succeeded'});
    } catch
        (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

exports.loginUser = async (req, res) => {
    const {email, password, device_token} = req.body;
    console.log(email)
    try {
        const user = await repo.findUserByEmail(email)
        if (!user) return res.status(404).send({'response': 'user not found'});
        const isAuth = await bcrypt.compareSync(password, user.password);
        if (isAuth) {
            await repo.updateDeviceToken(user.id_user, device_token)
            return res.status(200).send(user);
        } else {
            return res.status(401).send({'response': 'wrong password'});
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send();
    }
};

exports.deleteUser = async (req, res) => {
    const id_user = req.params.id
    try {
        const user = await repo.deleteUser(id_user)
        if (!user) return res.status(404).send();

        res.send({
            'response': `User deleted with ID: ${id_user}`
        })
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

exports.editUser = async (req, res) => {
    const id_user = req.params.id
    const {full_name, phone_number} = req.body
    let user;
    try {
        if (!full_name) {
            user = await repo.updatePhoneNumber(id_user, phone_number)
        } else if (!phone_number) {
            user = await repo.updateFullName(id_user, full_name)
        }

        if (!user) return res.status(404).send();

        res.send(`Updated user with ID: ${id_user}`)
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

exports.sendToken = async (req, res) => {
    const id = req.params.id
    const {type} = req.body
    const user = repo.findUserByID(id)
    let Registration = require('./mongo-model/user.models')
    if (user) {
        try {
            let token = Math.floor(Math.random() * 10000)
            const Register = new Registration({email: user.email, token: token, type: type})
            await Register.save()
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: process.env.SERVICE,
                port: 587,
                secure: true,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });
            if (type === 'FORGOT') {
                await transporter.sendMail({
                    from: process.env.USER,
                    to: user.email,
                    subject: "Forgot Password",
                    text: `Your token is ${token}`,
                });
            } else if (type === 'VERIFICATION') {
                await transporter.sendMail({
                    from: process.env.USER,
                    to: user.email,
                    subject: "Verification",
                    text: `Your token is ${token}`,
                });
            }


            res.status(200).send({"response": "email sent successfully"});
        } catch (e) {
            console.log(e)
            res.status(500).send()
        }
    }
}

