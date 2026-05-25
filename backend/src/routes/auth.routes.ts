import { Router } from "express";

import {
  register,
  login,
  currentUser,
} from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";

import { validate } from "../middleware/validate.middleware";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authMiddleware,
  currentUser
);

export default router;