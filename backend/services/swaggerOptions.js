const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Medicon API',
            description: 'Medicon API Information',
            contact: {
                name: 'Medicon'
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
            {
                url: "https://medicon-4pta.onrender.com"
            }
        ]
    },
    apis: ['./routes/v1/*.js', './index.js']
}

export default swaggerOptions;