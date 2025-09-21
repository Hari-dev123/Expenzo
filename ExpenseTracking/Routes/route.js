const express=require('express');
const User=require('../Models/userModel.js')
const authMiddleware = require('../middleware/authMiddleware');

const router=express.Router();

const{createUser,createIncome,createExpense,Login,totalIncome,
     totalExpense, totalBalance, deleteIncome, deleteExpense, updateIncome, 
     updateExpense, deleteUser, ExpenseByDate, IncomeByDate, getIncome, getExpense, 
     Incomesearch, Expensesearch, detailIncome,
     detailExpense} =require('../controller/UserController.js')

router.post('/register',createUser)

router.post('/income/:id',authMiddleware,createIncome)

router.post('/expense/:id',authMiddleware,createExpense)

router.post('/login',Login)

router.get('/income/total/:id',authMiddleware,totalIncome)

router.get('/incomes/:id',authMiddleware,getIncome)

router.get('/income/detail/:id',authMiddleware,detailIncome)

router.get('/expense/detail/:id',authMiddleware,detailExpense)


router.get('/expenses/:id',authMiddleware,getExpense)

router.get('/income/search/:id',authMiddleware,Incomesearch)

router.get('/expense/search/:id',authMiddleware,Expensesearch)

router.get('/expense/total/:id',authMiddleware,totalExpense)

router.get('/balance/:id',authMiddleware,totalBalance)

router.delete('/income/delete/:id',authMiddleware,deleteIncome)

router.delete('/expense/delete/:id',authMiddleware,deleteExpense)

router.delete('/:id',authMiddleware,deleteUser)

router.patch('/income/update/:id',authMiddleware,updateIncome)

router.patch('/expense/update/:id',authMiddleware,updateExpense)

router.get('/income/date/:id/:date',authMiddleware,IncomeByDate)


router.get('/expense/date/:id/:date',authMiddleware,ExpenseByDate)

module.exports=router;