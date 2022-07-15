import express from 'express';
import {verifyUser} from "../../middleware/verifyUser.js";
import accountInfo from "./accountInfo.js";
import accountAdmin from "./accountAdmin.js";
import accountProfilePicture from "./accountProfilePicture.js";
import {sequelizeChecker} from "../helper/sequelizeHelper.js";

const router = express.Router();

router.use("/profilePic", accountProfilePicture)

// the below path requires db manipulation
router.use(verifyUser)
router.use(sequelizeChecker)

router.use("/", accountInfo, accountAdmin)

export default router;
