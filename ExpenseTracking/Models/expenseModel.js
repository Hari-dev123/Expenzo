const mongoose=require('mongoose')

const expenseSchema=mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
     user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
},{
    timestamps:true
})

const Expense=mongoose.model('expense',expenseSchema)

module.exports=Expense