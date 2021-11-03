const {format, transports, createLogger} = require('winston');
require('dotenv').config()

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta'
    });
}

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({stack: true}),
                format.splat(),
                format.json()
            )
        }),
    ]
});


if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.File({
        filename: './log/error.log',
        level: 'error',
        format: format.combine(format.timestamp({format: timezoned}), format.json())
    }));
    logger.add(new transports.File({
        filename: './log/combined.log',
        format: format.combine(format.timestamp({format: timezoned}), format.json())
    }))
}

module.exports = logger