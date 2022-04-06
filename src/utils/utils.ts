import path from 'path';
import {promises as fs} from  'fs';
import { v4 as uuidv4 } from "uuid";


const transaction_database = path.join(__dirname, '..', '..', '/database/transaction.json');
const balances_database = path.join(__dirname, '..', '..', '/database/balances.json');


const writeDataToFile = async(filename: string, data: any) => {
        await fs.writeFile(filename, JSON.stringify(data, null, 3))
}

const readDataFromFile = async(filename: string) => {
   const data =  await fs.readFile(filename, 'utf8');
   return JSON.parse(data);
}

const check_If_Db_Exists = async(DB_Path: string) => {
    try {
        await fs.access(DB_Path,)
      } catch(err) {
        await writeDataToFile(DB_Path, []); 
      }
}

const findUserBalance = async(customerAccountNo: string) => {
   //  recieves a user account number and finds account balance, 
   // finds accounts details in the database and returns the user balance
  const customerBalance = await readDataFromFile(balances_database) 
  const customerAccount = customerBalance.find( (customer: {account: string}) => customer.account === customerAccountNo);
  return customerAccount;

}

const transaction = async(senderAcc: string, receiverAcc: string, amount: number) => {
    // get sender account balance, 
    // if the amount to be transferred is greater than the balance, and not less than 0
    // then subtract the amount from account balance, get reciever account balance and add amount
    // update the balance database
    // else return insufficient funds
  
    let updBalanceDB = await readDataFromFile(balances_database);
    let sender =  await findUserBalance(senderAcc);
    let receiver = await findUserBalance(receiverAcc);

    const senderIndex = updBalanceDB.findIndex((sender: any) => sender.account == senderAcc)
    const receiverIndex = updBalanceDB.findIndex((receiver: any) => receiver.account === receiverAcc)

    
    let newSenderBalance = sender.balance - amount;
    let newReceiverBalance = receiver.balance + amount;

        updBalanceDB[senderIndex] = { ...sender, balance: newSenderBalance }
        updBalanceDB[receiverIndex] = { ...receiver, balance: newReceiverBalance };
        
        if (process.env.NODE_ENV !== 'test') {
        writeDataToFile(balances_database, updBalanceDB);
        }
    
     const transactionReciept = {
            reference: uuidv4(),
            senderAccount: senderAcc, 
            amount: amount,
            receiverAccount: receiverAcc,
            transferDesc: `transferred ${amount} to ${receiverAcc}` ,
            createdAt: new Date().toString()
        }
     const transactionDb = await readDataFromFile(transaction_database);
        transactionDb.push(transactionReciept);
        
        if (process.env.NODE_ENV !== 'test') {
        writeDataToFile(transaction_database, transactionDb);
        }
        return transactionReciept;   

}


export {
    transaction_database,
    balances_database,
    findUserBalance,
    transaction,
    readDataFromFile,
    writeDataToFile,
    check_If_Db_Exists,
    
   
}