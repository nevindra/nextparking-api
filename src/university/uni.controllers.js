const {Client} = require("@googlemaps/google-maps-services-js");
const logger = require('../../config/logger');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.searchUniversity = async (req, res) => {
    const search = req.query.search;
    try {
        const result = await prisma.universities.findMany({
            where: {
                name: {
                    contains: search
                }
            }
        })
        res.status(200).json({
            status: 200,
            data: result
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

// get all university
exports.getAllUniversity = async (req, res) => {
    try {
        const result = await prisma.universities.findMany()
        res.status(200).json({
            status: 200,
            data: result
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.getUniversityDistance = async (req, res) => {
    const {long, lat} = req.body
    let origins = [];
    // combine lat and long to string with comma and then push to origins array
    origins.push(`${lat},${long}`);
    let destinations = [];
    const universities = await prisma.universities.findMany();
    universities.forEach(university => {
        destinations.push(university.address)
    });
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
        // add data from locations and destinations to new array
        let universities = [];
        locations.forEach(location => {
            universities.push({
                distance: location.distance.text,
                duration: location.duration.text,
                university: destinations[locations.indexOf(location)]
            })
        })
        let sorted = universities.sort((a, b) => a.distance.value - b.distance.value);
        res.status(200).json({
            status: 200,
            data: sorted
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.getSingleUniversity = async (req, res) => {
    const id_place = req.params.id_university
    try {
        const result = await prisma.universities.findUnique({where: {id_place: parseInt(id_place)}})
        res.status(200).json({
            status: 200,
            data: result
        })
    } catch (e) {
        console.log(e)
        logger.error(e);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        })
    }
}