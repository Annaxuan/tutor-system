import express from 'express';
import { verifyAdmin, verifyUser } from '../middleware/verifyUser.js';
import db  from '../models/index.js';
import { CoursePictureReference, put, get, deleteSingle} from './helper/fileUploadHelper.js';
import multer from "multer";

const router = express.Router()

router.get('/', async(req, res) => {
    try {
        let existedCourse = await db.Course.findAll()
        
        res.status(201).json(existedCourse)

    } catch (error) {
      return res.status(500).json({message: error.message})
    }
});

router.get('/:id', async(req, res) => {
  try {
    let existedCourse = await db.Course.findByPk(parseInt(req.params.id));
    if (!existedCourse){
        throw new Error("course with id" + req.params.id + " can not be found.")
    }
      
    res.status(201).json(existedCourse)

  } catch (error) {
    return res.status(500).json({message: error.message})
  }
});

router.post('/', async(req, res) => {
    try {
        let existedCourse = await db.Course.findOne({where: {courseNum: req.body.courseNum}})
        if (existedCourse){
            throw new Error("course " + req.body.courseNum + " existed already.")
        }

        const {courseNum, courseName, courseInfo, campus} = req.body
        const newCourse = await db.Course.create ({courseNum, courseName, courseInfo, campus})
        res.status(201).json(newCourse)

    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  });

router.put('/:id', async(req, res) => {
    try {
        let existedCourse = await db.Course.findByPk(parseInt(req.params.id));
        if (!existedCourse){
            throw new Error("course with id" + req.params.id + " can not be found.")
        }

        const {courseNum, courseName, courseInfo, campus} = req.body
        const courses = await db.Course.update ({courseNum, courseName, courseInfo, campus},{
            where: {id: parseInt(req.params.id)}
        })

        let updateCourse = await db.Course.findByPk(parseInt(req.params.id))

        res.status(200).json(updateCourse)

    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  });


router.delete('/:id', async(req, res) => {
    try {
        let existedCourse = await db.Course.findByPk(parseInt(req.params.id));
        if (!existedCourse){
            throw new Error("course with id" + req.params.id + " can not be found.")
        }
        ;

        await db.sequelize.transaction(async t => {
          const courses = await db.Course.destroy ({
            where: {id: parseInt(req.params.id)},
            transaction : t
        })

        const coursePictureRef = new CoursePictureReference(parseInt(req.params.id));
	    	await deleteSingle(coursePictureRef);

        })

        res.status(204).send();

    } catch (error) {
      return res.status(500).json({message: error.message})
    }
  });




/**
 * Get the profile picture for the user with id
 */
router.get('/coursePic/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const coursePictureReference = new CoursePictureReference(id);
		get(coursePictureReference).createReadStream().pipe(res)
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

/**
 * Change user picture
 */
 router.post('/coursePic/:id', verifyUser, verifyAdmin, multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
	}
}).single("coursePicture"), async (req, res) => {
	const coursePicture = req.file
  const {id} = req.params;
	if (!coursePicture) {
		res.status(400).send("Cannot upload such file");
		return
	}

	try {
		const coursePictureRef = new CoursePictureReference(id);
		await put(coursePictureRef, coursePicture.buffer)
		res.send("Upload successful")
	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
})

export default router;