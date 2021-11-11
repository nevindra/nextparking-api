const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const bcrypt = require("bcrypt");
const logger = require("../../config/logger");
const {uuid} = require('uuidv4');
const prisma = new PrismaClient();

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
}

const {TokenExpiredError} = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(403).send({
            status: 403,
            message: "Unauthorized! Access Token was expired!"
        });
    }
    return res.status(401).send({
        status: 401,
        message: "Token is not valid!"
    });
}

const createRefreshToken = async (user) => {

    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(process.env.JWT_REFRESH_EXPIRES));

    const result = convertTZ(expiredAt, "Asia/Jakarta");

    let _token = uuid();

    try {
        let refreshToken = await prisma.jwt_token.create({
            data: {
                token: _token,
                expired_at: result,
                id_user: user.id_user
            }
        })
        return refreshToken.token;
    } catch (e) {
        if (e.code === "P2002") {
            throw new Error("Refresh Token already exists!");
        }
    }
}

const verifyRefreshToken = async (token) => {
    return token.expired_at.getTime() < new Date().getTime();
}

const verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).send({error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];


    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        req.id_user = decoded.id_user;
        next();
    });
}

const loginUser = async (req, res) => {
    const {email, password, device_token} = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(404).json({
                status: '404',
                message: "User not found"
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                status: '401',
                message: "Wrong password"
            });
        }
        const date = new Date()
        const currentDate = convertTZ(date, "Asia/Jakarta")
        await prisma.users.update({where: {email}, data: {device_token, last_login: currentDate}})

        const accessToken = jwt.sign({
            id_user: user.id_user,
        }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES)
        });

        const refreshToken = await createRefreshToken(user);
        return res.status(200).json({
            status: 200,
            message: "Login success",
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (e) {
        // logger.error(e);
        return res.status(403).json({
            status: '403',
            message: "Refresh Token already exists!"
        });
    }
};

const refreshToken = async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            status: 401,
            message: "Refresh Token is required!"
        });
    }

    try {
        let refreshTokenData = await prisma.jwt_token.findUnique({
            where: {
                token: refreshToken
            }
        })
        if (!refreshTokenData) {
            return res.status(401).json({
                status: 401,
                message: "Refresh Token is not found!"
            });
        }

        if (await verifyRefreshToken(refreshTokenData)) {
            await prisma.jwt_token.delete({
                where: {
                    token: refreshToken
                }
            })
            return res.status(403).json({
                status: 403,
                message: "Refresh Token is expired! Please make a new login request."
            });
        }

        const user = await prisma.jwt_token.findUnique({
            where: {
                token: refreshToken
            }
        })

        let newAccessToken = jwt.sign({id_user: user.id_user}, process.env.JWT_ACCESS_SECRET, {
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES)
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshTokenData.token,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
}

const logout = async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            message: 'No token provided.'
        });
    }

    try {
        let token = await prisma.jwt_token.findUnique({
            where: {
                token: refreshToken
            }
        })
        if (!token) {
            return res.status(401).json({
                message: 'Invalid token.'
            });
        }

        await prisma.jwt_token.delete({
            where: {
                token: refreshToken
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Logout success"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 500,
            message: 'Failed to authenticate token.'
        });
    }
}

auth = {
    loginUser,
    verifyToken,
    refreshToken,
    logout
}

module.exports = auth;