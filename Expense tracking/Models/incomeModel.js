const mongoose=require('mongoose');

const incomeSchema=mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    description:{

        type:String,
        required:true,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    
},{
    timestamps:true
})

const Income=mongoose.model('Income',incomeSchema)
module.exports=Income