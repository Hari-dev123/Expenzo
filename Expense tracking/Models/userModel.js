const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    status:{
        type:Number,
        default:1

    },
    name:
    {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})

const User=mongoose.model('User',userSchema);
module.exports=User