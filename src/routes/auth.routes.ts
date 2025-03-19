import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate, validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validate('register'), validationMiddleware, register);
router.post('/login', validate('login'), validationMiddleware, login);

export default router;
