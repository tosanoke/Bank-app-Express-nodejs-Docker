import { z, AnyZodObject } from "zod";
import {Request, Response, NextFunction} from 'express';

const balanceSchema = z.object({
    body: z.object({
      balance: z.number({
         required_error:"input a valid amount"
      }).positive(),
    }),
  });

const transferSchema = z.object({
  body: z.object({
    from: z.string({
      required_error: "account number is required",
    }).length(10),

    to: z.string({
      required_error: "account number is required",
    }).length(10),

    amount: z.number({
      required_error:"input a valid amount"
   }).positive()

  }),
});
  
  const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
};


export {
    validate,
    balanceSchema,
    transferSchema
}