const mongoose = require('mongoose')

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(()=>{
          console.log("connected to db")
        })
    } catch (error) {
          console.log("error while connecting to db " , error)
    }
}

module.exports = connectToDB