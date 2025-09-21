import React, { useEffect, useState } from 'react'
import axios from'axios'
import Index from './Index'
const token=localStorage.getItem('token')
const userid=localStorage.getItem('_id')
const Dashboard = () => {

    const[income,setincome]=useState();
    const [expense,setExpense]=useState();
    const [balance,setbalance]=useState();

    useEffect(()=>{
       const totalincome=async()=>{
           try{
        const res=await axios.get(`http://localhost:3000/api/income/total/${userid}`,{

headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,
        }
    })
 setincome(res.data.totalincome)}
 catch(e){
    console.log(e.message)
 }
    };totalincome()  

     const totalexpense=async()=>{
            try{
        const res=await axios.get(`http://localhost:3000/api/expense/total/${userid}`,{

headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,
        }
    })
 setExpense(res.data.totalexpense)

}
 catch(e){
    console.log(e.message)
 }
    };totalexpense()

  const Balance=async()=>{
            try{
        const res=await axios.get(`http://localhost:3000/api/balance/${userid}`,{

headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,
        }
    })

 setbalance(res.data.balance)

}
 catch(e){
    console.log(e.message)
 }
    };Balance()


},[userid,token])
  return (
  
    <div className='mb-20'>
        <Index/>
     <div
            className="card mb-5 shadow-sm"
              style={{ cursor: "pointer" }}
            >
              <div className="card-body ">
                <h5 className="card-title">Total Incomes</h5>
                <p className="card-text ml-20"> Rs.{income}</p>
              </div>
            </div>
    <div
            className="card mb-5 shadow-sm"
              style={{ cursor: "pointer" }}
            >
              <div className="card-body ">
                <h5 className="card-title">Total Expense</h5>
                <p className="card-text ml-20"> Rs.{expense}</p>
              </div>
            </div>
    <div
            className="card mb-5 shadow-sm"
              style={{ cursor: "pointer" }}
            >
              <div className="card-body ">
                <h5 className="card-title">Balance</h5>
                <p className="card-text ml-20"> Rs.{balance}</p>
              </div>
            </div>
    </div>
  )
}

export default Dashboard
