
import { useState,useEffect } from 'react'
import axios from 'axios'
import Index from './Index';
const Income = () => {
     const token = localStorage.getItem("token");

    const [Incomelist,setIncomelist]=useState([])
    const [selectIncome,setselectIncome]=useState(null)
    const [edit,setEdit]=useState(false)
    const [updateAmount,setupdateAmount]=useState("")
    const[updateDescription,setUpdatedDescription]=useState("")
    const userid=localStorage.getItem("_id")
 const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    useEffect(()=>{
        fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/incomes/${userid}?page=${page}&limit=5`,{
            headers:{
                Authorization:` ${token}`
            }
        })
        .then((response)=>
            {if(!response.ok){
            throw Error("Couldn't Find Data")
        }return response.json()})
        .then((data)=>{ setIncomelist(Array.isArray(data.response) ? data.response : []);
           
          setTotalPages(data.totalPages || 1);
        
        })
        .catch((error)=>{
            console.log(error.message)
        })

    },[token,userid,page])

    const IncomeById=(id)=>{

        
            fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/income/detail/${id}`,{
                headers:{
                    Authorization:`${token}`
                }
            })
            .then(response=>{
                if(!response.ok){
                    throw Error("couldn't retrive data")
                }
                return response.json()
            })
            .then(data=>{
               setselectIncome( data.income||null)
            })

            .catch((e)=>{
                console.log(e.message)
            })
            console.log(id)
        }

const UpdateIncome=(id)=>{
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/income/update/${id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,

        },
        body:JSON.stringify({
            amount:updateAmount,
            description:updateDescription

        }),
    }).then((response)=>{
        if(!response.ok){
            throw Error("Update Failed")
        }
        return response.json()

    })
    .then((data)=>{
        alert("Income Updated successfully")
        setselectIncome(data.income);
        setIncomelist(prevList =>
            prevList.map(item =>
                item._id === id ? { ...item, amount: updateAmount, description: updateDescription } : item
            ))
        setEdit(false);


    })
    .catch(e =>{
        console.log(e.message)
    })

}

const DeleteIncome=(id)=>{
  if (!window.confirm("Are you sure you want to delete this Income?")) return;
   fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/income/delete/${id}`,{
        method:"Delete",
        headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,

        }})
        .then(response=>{
          if(!response.ok){
            throw Error("Can't Delete Right Now ,Please Try Again Later")
          }
          return response.json()})
          .then(()=>{
            alert("Income Deleted Successfully")
            setselectIncome(null);
        setIncomelist(Incomelist.filter((exp) => exp._id !== id));

          })
        .catch(e=>{
          console.log(e.message)
        })


}
const search=(search)=>{
  fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/income/search/${userid}?page=1&limit=20&search=${search}`,{
    method:"get",
        headers:{
            "Content-Type":"application/json",
            Authorization:`${token}`,

        }})
        .then(response=>{
          if(!response.ok){
            throw Error("Can't Delete Right Now ,Please Try Again Later")
          }
          return response.json()})
          .then((data)=>{
          
            console.log(data.Income)
          
        setIncomelist(data.Income);

          })
        .catch(e=>{
          console.log(e.message)
        })


  

}

        
    

  return (

    
  <div>
    <Index/>
    {/* Show list only when no Income is selected */}
    {selectIncome === null ? (
      <>



 

        <h2 className="text-center mb-3">Income List</h2>
       
       <div className="d-flex justify-content-center mb-3">
 
  <input type="text" 
  className="form-control" 
  placeholder="🔎︎ Search........."
   onChange={(e)=>search(e.target.value)}
   aria-label="Search" 
   aria-describedby="basic-addon1"
   style={{width:"50%"}}
   />
</div>
        {Incomelist.length > 0 ? (
          Incomelist.map((Income) => (
            <div
              key={Income._id}
              className="card mb-3 shadow-sm"
              onClick={() => IncomeById(Income._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h5 className="card-title">Amount: {Income.amount}</h5>
                <p className="card-text">Description: {Income.description}</p>
              </div>
            </div>


          ))


          
      
        ) : (
          <p>No Incomes found</p>
        )}
        <div className="d-flex justify-content-center mt-3">
  <button
    className="btn btn-primary me-2"
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
  >
    Previous
  </button>
  <span className="align-self-center">Page {page} of {totalPages}</span>
  <button
    className="btn btn-primary ms-2"
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
  >
    Next
  </button>
</div>

      </>
    ) :(
    
      edit? (<div className='card  p-3'>
        
        <h4 className="text-center">Income</h4>
        <input className="form-control mb-3" value={updateAmount} onChange={(e)=>{setupdateAmount(e.target.value)}}/>
        <input className="form-control mb-3"  value={updateDescription} onChange={(e)=>{setUpdatedDescription(e.target.value)}}/>
        <div className=" d-flex justify-content-end align-items-center">
        <button className="btn btn-success me-2" onClick={()=>UpdateIncome(selectIncome._id)}>Update</button>
         <button className="btn btn-secondary me-2" onClick={()=>setEdit(false)}>Cancel</button>
</div>
      </div>
      
    
    )
    :
    

    
     (
      // Show selected Income details
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Income Details</span>
          <button
            className="btn btn-sm "
            onClick={() => setselectIncome(null)}
          >
            Back to List
          </button>
        </div>
        <div className="card-body">
          <h5>Amount: {selectIncome.amount}</h5>
          <p>Description: {selectIncome.description}</p>
          <p>Date: {new Date(selectIncome.createdAt).toLocaleString()}</p>

<div className="d-flex justify-content-end align-items-center">
           <button
            className="btn btn-sm btn-warning m-2"
            onClick={() => {setupdateAmount(selectIncome.amount)
              setUpdatedDescription(selectIncome.description);
              setEdit(true)}}
            style={{ cursor: "pointer" }}
          >
            update
          </button>
          <br/>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => DeleteIncome(selectIncome._id)}
            style={{ cursor: "pointer" }}
          >
            Delete
          </button>
</div>
        </div>

       
      </div>
    ))}
  </div>


);
}


export default Income;
