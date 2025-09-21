import React, { useState } from 'react'
import axios from 'axios'
import Index from './Index';

const AddExpense = () => {


    const token=localStorage.getItem("token");
    const userId=localStorage.getItem("_id")
    const [amount,setAmount]=useState("");
    const[description,setDescription]=useState("")
    const [error,setError]=useState({})


    const Validate =()=>{

        let newError={}
        if(!amount.trim()){
            newError.amount="Amount field is required"
        }
        else if(!/^\d+$/.test(amount)){
            newError.amount="Amount field must be Numbers Only "
        }
         if (!description.trim()) {
    newError.description = "Description is required";
  }
        setError(newError)
          return Object.keys(newError).length===0
    }


const submit=async(e,id)=>{
        e.preventDefault();

    if(!Validate()) return
try{
    const res=await axios.post(`http://localhost:3000/api/expense/${userId}`,
        {
         
        
         
          amount: amount,
          description: description
            
        },

        {
        headers:{
            Authorization:`${token}`,
            "Content-Type":"application/json"
        }},
        

    
)
    alert(res.data.message)
    setAmount("")
    setDescription("")
    setError({})   
}
catch(e){
    if(e.response&&e.response.data&&e.response.data.message){
        const backendMessage=e.response.data.message
    
    setError({general:backendMessage})
}
else{
    setError({general:"Can't Add expense Now please Try Again Later"})
}

}
console.log(token)

}

 

  return (
    <div >
        <Index/>
          <h2 className=' text-center mb-3'>Add expense</h2>
        
        <div className='card'><form onSubmit={submit}>
            {error.general && (
            <div className="alert alert-danger">{error.general}</div>
          )}
      <div className="mb-3">
  <label htmlFor="amount" className="form-label ">Amount</label>
  <input type="text"  className={`form-control ${error.amount ? "is-invalid" : ""}`} id="amount"  value={amount} onChange={(e)=>{setAmount(e.target.value)}}placeholder="Enter the Amount " />
 {error.amount && <div className="invalid-feedback">{error.amount}</div>}
</div>

<div className="mb-3">
  <label htmlFor="description" className="form-label">Description</label>
  <textarea  className={`form-control ${error.description ? "is-invalid" : ""}`} id="description" rows="4" value={description} onChange={(e)=>{setDescription(e.target.value)}} placeholder='expense Description'></textarea>
{error.description && <div className="invalid-feedback">{error.description}</div>}
</div>
 
<button className='btn btn-primary ' type="submit">
    Submit

</button>
</form>
</div>
    </div>
  )
}

export default AddExpense
