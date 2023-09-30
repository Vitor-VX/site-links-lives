const mongoose = require("mongoose")
require("dotenv").config()

async function connect() {
    return await mongoose.connect(`mongodb+srv://${process.env.USERNAME_DATA_BASE}:${process.env.PASSWORD}@bancodedadosvitor-vx.6awlvqi.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

connect().then(result => console.log(`Conectado ao banco de dados.`))

module.exports = connect