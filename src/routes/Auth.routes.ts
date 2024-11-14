import { Router } from "express";
import { RefreshTokenController } from "../controllers/auth/RefreshToken.controller";
import { SignInController } from "../controllers/auth/SignIn.controller";
import { SignUpController } from "../controllers/auth/SignUp.controller";
import { ResetPasswordController } from "../controllers/auth/ResetPassword.controller";
import { ForgotPasswordController } from "../controllers/auth/ForgotPassword.controller";
import { ActiveAccountController } from "../controllers/auth/ActiveAccount.controller";
import { ResendActiveAccountController } from "../controllers/auth/ResendActiveAccount.controller";

export const AuthRouter = Router();

AuthRouter.post("/refresh-token", new RefreshTokenController().handle);
AuthRouter.post("/signin", new SignInController().handle);
AuthRouter.post("/signup", new SignUpController().handle);
AuthRouter.post("/forgot-password", new ForgotPasswordController().handle);
AuthRouter.post("/reset-password", new ResetPasswordController().handle);
AuthRouter.post("/active-account", new ActiveAccountController().handle);
AuthRouter.post(
  "/resend-active-account",
  new ResendActiveAccountController().handle
);
