const Subject = require('../models/Subject');
const path = require('path');
const { upload } = require('../middleware/FileUpload');

const folderName = 'subject';
const uploadMiddleware = upload(folderName);

class SubjectController {
    async getSubject(req, res) {
        try {
            const subjects = await Subject.find()
            .populate([
                {path: '_id', select: "title filial"}
            ])
            res.json(subjects);
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    }

    async createSubject(req, res) {
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }

                const { title, filial } = req.body;
                const checkSubTitle = await Subject.findOne({ title });
                if (checkSubTitle) {
                    return res.status(400).json("Subject with this title already exists");
                }

                const photo = req.file ? req.file.path : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

                const newSubject = new Subject({ title, filial, photo });
                const savedSubject = await newSubject.save();

                return res.status(201).json({savedSubject});
                // res.json({ message: 'Subject created successfully' });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }

    async updateSubject(req, res) {
            try {
                uploadMiddleware(req, res, async function (err) {
                    if (err) {
                        return res.status(400).send({ message: err.message });
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

                    const subject = await Subject.findById(subjectId);
                    
                    if (subject && subject.photo) {
                        const filePath = path.join(__dirname, '..', subject.photo);
                        deleteFile(filePath)
                    }
                }
                const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updatedFields);

                return res.status(201).json({updatedSubject});
                // res.json({updatedSubject, message: 'Subject updated successfully' });
                });
            } catch (error) {
                console.error(error);
                res.status(500).send('Server Error');
            }
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
                deleteFile(filePath)
            }

            res.json({ message: 'Subject deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new SubjectController();
