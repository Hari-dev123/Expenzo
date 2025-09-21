const mongoose=require('mongoose')

const connectDb=async()=>{

mongoose.connect('mongodb://localhost:27017/user')
  .then(() => console.log('Connected!'))
  .catch(()=>console.log('connection failed'));

}
module.exports=connectDb;