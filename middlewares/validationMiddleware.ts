import { Request, Response, NextFunction } from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors: { [key: string]: string }[] = [];
      return res.status(422).json({ errors: extractedErrors });
    }

    return next();
  };
};

export { validate };
