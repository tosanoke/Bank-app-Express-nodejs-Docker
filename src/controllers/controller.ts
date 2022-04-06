import { Response, Request } from "express";
import { customAlphabet } from 'nanoid/async'
import {transaction_database, balances_database, writeDataToFile, readDataFromFile, findUserBalance, transaction, check_If_Db_Exists} from '../utils/utils'

// generate unique number
const nanoid = customAlphabet('12345678900', 10)

const createAccount = async (req: Request, res: Response) => {
try {
      check_If_Db_Exists(balances_database);
      
      const body = req.body;
      const newAccount = {
          account: await nanoid(),
          balance: body.balance,
          createdAt: new Date().toISOString()
      }

      const data = await readDataFromFile(balances_database);
      data.push(newAccount);
      
      if (process.env.NODE_ENV !== 'test') {
      writeDataToFile(balances_database, data);
      }
      res.status(201).json(data)
} catch(err) {
    res.status(400).json({"error": "unable to create account"})
}   
   

}

const getUserBalance = async(req: Request, res: Response) => {
   try {
    const userBalance = await findUserBalance(req.params.accountNumber)
     res.status(200).json(userBalance)
   }catch(err) {
    res.status(404).json({ message: "cannot find resource"})
   }

}

const getAllBalance = async(req: Request, res: Response) => {
    try{ 
        const balance = await readDataFromFile(balances_database)
        res.status(200).json(balance)
    } catch(err){
        res.status(400).json({'error': 'error getting all balance'})
    }
    
}

const transfer = async(req: Request, res: Response) => {
    // recieves the transfer request from the body and generates a transaction transaction
    // reciept and updates to the transaction database
    try {
        check_If_Db_Exists(transaction_database);
        const data = req.body;
        const {from, to, amount} = data;
        const sender =  await findUserBalance(from);

        if(sender.balance > amount) {
        const reciept = await transaction(from, to, amount);
        res.status(201).json(reciept);
        } else {
        res.status(401).json({msg: 'insufficient funds'})
        }     
   } catch(error) {
       res.status(404).json({msg: 'Account number not found'})
   }
}


export {
    createAccount,
    getAllBalance,
    getUserBalance,
    transfer
}