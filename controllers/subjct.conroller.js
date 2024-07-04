const Subject = require('../models/Subject');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = './uploads/';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB file size limit
    },
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('photo');

class SubjectController {
    async getSubject(req, res) {
        try {
            const subjects = await Subject.find().populate('filial', 'title subject');
            res.json(subjects);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async createSubject(req, res) {
        upload(req, res, async function (err) {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const { title, filial } = req.body;
                const checkSubTitle = await Subject.findOne({ title });
                if (checkSubTitle) {
                    return res.status(400).json("Subject with this title already exists");
                }

                const photo = req.file ? req.file.path : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

                const newSubject = new Subject({ title, filial, photo });
                await newSubject.save();

                res.json({ message: 'Subject created successfully' });
            } catch (error) {
                console.log(error);
                res.status(500).send('Server Error');
            }
        });
    }

    async updateSubject(req, res) {
        upload(req, res, async function (err) {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Error uploading file' });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const subjectId = req.params.id;
                const { title, filial } = req.body;
                const photo = req.file ? req.file.path : undefined;

                if (!title || !filial || (req.file && !photo)) {
                    return res.status(400).json('Please fill in all fields');
                }

                const updatedFields = { title, filial };
                if (photo !== undefined) {
                    updatedFields.photo = photo;
                }

                await Subject.findByIdAndUpdate(subjectId, updatedFields);

                res.json({ message: 'Subject updated successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }
        });
    }

    // Delete 
    async deleteSubject(req, res) {
        try {
            const subjectId = req.params.id;

            const subject = await Subject.findById(subjectId);
            if (!subject) {
                return res.status(404).json('Subject not found');
            }

            await Subject.findByIdAndDelete(subjectId);

            if (subject.photo) {
                const filePath = path.join(__dirname, '..', subject.photo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`File deleted: ${filePath}`);
                } else {
                    console.log(`File not found: ${filePath}`);
                }
            }

            res.json({ message: 'Subject deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new SubjectController();
