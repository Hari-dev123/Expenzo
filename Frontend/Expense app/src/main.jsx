import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login.jsx'
import SignUp from './Sign-in.jsx'
import {createBrowserRouter,RouterProvider}from 'react-router-dom'
import Income from './Income.jsx'
import Expense from './Expense.jsx'
import Index from './Index.jsx'
import AddIncome from './AddIncome.jsx'
import AddExpense from './AddExpense.jsx'
import Dashboard from './Dashboard.jsx'
import IncomeByDate from './IncomeByDate.jsx'


const router=createBrowserRouter([
  {
    path:'/',
    element:<Login/>

  },
  {
    path:'/index',
    element:<Index/>
  },
  {
    path:'/dashboard',
    element:<Dashboard/>
  },
  {
    path:'/signin',
    element:<SignUp/>
  },
  {
    path:'/income',
    element:<Income/>
  },
  {
    path:'/expense',
    element:<Expense/>
  },{
    path:'/income/add',
    element:<AddIncome/>
  },
  {
    path:'/expense/add',
    element:<AddExpense/>
  },{
    path:'/date',
    element:<IncomeByDate/>
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={router}/>
  </StrictMode>
    
    
    
  
  
)
