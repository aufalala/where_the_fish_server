import { Router } from "express";
import { refreshTokenController, signInController, signOutController, signUpController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signin", signInController);
router.post("/signup", signUpController);
router.post("/refresh", refreshTokenController);
router.post("/signout", signOutController);


export default router;
