import multer from "multer";
import {exists, get, put, UserProfilePictureReference} from "../helper/fileUploadHelper.js";
import express from "express";
import {verifyAdmin, verifyUser} from "../../middleware/verifyUser.js";

const profilePictureRoute = express.Router();

/**
 * Get the profile picture for the user with id
 */
profilePictureRoute.get('/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const profilePictureReference = await profilePictureReferenceOf(id)
		get(profilePictureReference).createReadStream().pipe(res)
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

const profilePictureReferenceOf = async (id) => {
	const profilePictureRef = new UserProfilePictureReference(id)
	if(await exists(profilePictureRef)) {
		return profilePictureRef
	} else {
		return UserProfilePictureReference.getDefault()
	}
}

/**
 * Get the current user's profile picture
 */
profilePictureRoute.get('/', verifyUser, async (req, res) => {
	const userId = req.user.id;
	try {
		const profilePictureReference = await profilePictureReferenceOf(userId)
		get(profilePictureReference).createReadStream().pipe(res)
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

/**
 * Change user picture
 */
profilePictureRoute.post('/', verifyUser, multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
	}
}).single("profilePicture"), async (req, res) => {
	const userId = req.user.id;
	const profilePicture = req.file
	if (!profilePicture) {
		res.status(400).send("Cannot upload such file");
		return
	}

	try {
		const profilePictureRef = new UserProfilePictureReference(userId)
		await put(profilePictureRef, profilePicture.buffer)
		res.send("Upload successful")
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

export default profilePictureRoute;
