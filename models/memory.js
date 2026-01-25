const mongoose = require ('mongoose'); 

const memorySchema = new mongoose.Schema({

}, {timestamps: true}); 
const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;