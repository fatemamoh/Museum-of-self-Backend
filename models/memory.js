const mongoose = require ('mongoose'); 

const memorySchema = new mongoose.Schema({

title:{
    type:String,
    required:[true, 'Every artifact needs a title for the muesum catalog'],
    trim:true
}, 

type:{
    type:String,
    enum:['Text','Image','Video','Audio',,'Link'],
    default:'Text'
},

size:{
    type:String,
    enum:['Small', 'Medium', 'Large'],
    default:'Medium'
},
contentUrl:{
    type:String,
    required: function() {return this.type!== 'Text'}
},

story:{
    type:String
},
curatorNote:{
    type:String,
    maxlength: 150
},

}, {timestamps: true}); 
const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;