const mongoose = require ("mongoose")

const likeSchema = mongoose.Schema ({
    userId: { type : String },
    like: { type : Number }
})

module.exports = mongoose.model("Like", likeSchema)