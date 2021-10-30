const {Client} = require("@googlemaps/google-maps-services-js");
const logger = require('../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.searchUniversity = async (req, res) => {
    const {search} = req.body
    try {
        const result = await prisma.universities.findMany({
            where: {
                name: {
                    contains: search
                }
            }
        })
        res.status(200).send(result)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
}

exports.getAllUniversity = async (req, res) => {
    const universities = await prisma.universities.findMany();
    let destinations = [];

    for (let uni of universities) {
        destinations.push(uni.address)
    }

    let origins = ["-6.538755,106.8101117"];

    const client = new Client({});
    try {
        const results = await client.distancematrix({
            params: {
                origins: origins,
                destinations: destinations,
                key: process.env.GOOGLE_API_KEY
            }
        })
        let locations = results.data.rows[0].elements
        let sorted = locations.sort((a, b) => a.distance.value - b.distance.value);
        res.status(200).send(sorted)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}

exports.getSingleUniversity = async (req, res) => {
    const {id_place} = req.body

    try {
        const result = await prisma.universities.findUnique({where: {id_place: parseInt(id_place)}})
        res.status(200).send(result)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
}