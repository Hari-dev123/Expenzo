
import { useState,useEffect } from 'react'
import Index from './Index';
const Expense = () => {
     const token = localStorage.getItem("token");
 const userid=localStorage.getItem("_id")
    const [Expenselist,setExpenselist]=useState([])
    const [selectExpense,setselectExpense]=useState(null)
    const [edit,setEdit]=useState(false)
    const [updateAmount,setupdateAmount]=useState("")
    const[updateDescription,setUpdatedDescription]=useState("")
const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    useEffect(()=>{
        fetch(`http://localhost:3000/api/expenses/${userid}?page=${page}&limit=5`,{
            headers:{
                Authorization:` ${token}`
            }
        })
        .then((response)=>
            {if(!response.ok){
            throw Error("Couldn't Find Data")
        }return response.json()})
        .then((data)=>{ setExpenselist(Array.isArray(data.response) ? data.response : []);
    setTotalPages(data.totalPages || 1);
        })
        .catch((error)=>{
            console.log(error.message)
        })

    },[token,userid,page])

    const expenseById=(id)=>{

        
            fetch(`http://localhost:3000/api/expense/detail/${id}`,{
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
               setselectExpense( data.Expense||null)
            })

            .catch((e)=>{
                console.log(e.message)
            })
            console.log(id)
        }

const Updateexpense=(id)=>{
    fetch(`http://localhost:3000/api/expense/update/${id}`,{
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
        alert("Expense Updated successfully")
        setselectExpense(data.expense);
        setExpenselist(prevList =>
            prevList.map(item =>
                item._id === id ? { ...item, amount: updateAmount, description: updateDescription } : item
            ))
        setEdit(false);


    })
    .catch(e =>{
        console.log(e.message)
    })

}

const DeleteExpense=(id)=>{
  if (!window.confirm("Are you sure you want to delete this expense?")) return;
   fetch(`http://localhost:3000/api/expense/delete/${id}`,{
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
            alert("Expense Deleted Successfully")
            setselectExpense(null);
        setExpenselist(Expenselist.filter((exp) => exp._id !== id));

          })
        .catch(e=>{
          console.log(e.message)
        })


}
const search=(search)=>{
  fetch(`http://localhost:3000/api/expense/search/${userid}?page=1&limit=20&search=${search}`,{
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
          
          
          console.log(data.Expense);
        setExpenselist(data.Expense);

          })
        .catch(e=>{
          console.log(e.message)
        })


  

}

        
    

  return (
  <div>
    <Index/>
    {/* Show list only when no expense is selected */}
    {selectExpense === null ? (
      <>
        <h2 className="text-center mb-3">Expense List</h2>
             
       <div className="d-flex justify-content-center mb-3">
       
 
  <input type="text" 
  className="form-control" 
  placeholder="🔎︎ Search........."
   onChange={(e)=>search(e.target.value)}
   aria-label="Search" 
   aria-describedby="basic-addon1"
    style={{width:"50%"}}/>
  
</div>
        {Expenselist.length > 0 ? (
          Expenselist.map((Expense) => (
            <div
              key={Expense._id}
              className="card mb-3 shadow-sm"
              onClick={() => expenseById(Expense._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h5 className="card-title">Amount: {Expense.amount}</h5>
                <p className="card-text">Description: {Expense.description}</p>
              </div>
              
            </div>
            

            

                  
          ))

          
        ) : (
          <p>No Expenses found</p>
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
    
      edit? (<div className='card mt-4 p-3'>
        
        <h4 className="text-center">Expense</h4>
        <input className="form-control mb-3" value={updateAmount} onChange={(e)=>{setupdateAmount(e.target.value)}}/>
        <input className="form-control mb-3"  value={updateDescription} onChange={(e)=>{setUpdatedDescription(e.target.value)}}/>
        <div className=" d-flex justify-content-end align-items-center">
        <button className="btn btn-success me-2" onClick={()=>Updateexpense(selectExpense._id)}>Update</button>
         <button className="btn btn-secondary me-2" onClick={()=>setEdit(false)}>Cancel</button>
</div>
      </div>
      
    
    )
    :
    

    
     (
      // Show selected expense details
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Expense Details</span>
          <button
            className="btn btn-sm "
            onClick={() => setselectExpense(null)}
          >
            Back to List
          </button>
        </div>
        <div className="card-body">
          <h5>Amount: {selectExpense.amount}</h5>
          <p>Description: {selectExpense.description}</p>
          <p>Date: {new Date(selectExpense.createdAt).toLocaleString()}</p>

<div className="d-flex justify-content-end align-items-center">
           <button
            className="btn btn-sm btn-warning m-2"
            onClick={() => {setupdateAmount(selectExpense.amount)
              setUpdatedDescription(selectExpense.description);
              setEdit(true)}}
            style={{ cursor: "pointer" }}
          >
            update
          </button>
          <br/>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => DeleteExpense(selectExpense._id)}
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


export default Expense;
