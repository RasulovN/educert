const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createStorage(folderName) {
    // const uploadDirectory = path.join(__dirname, '../uploads/', folderName);
    const uploadDirectory =  `./uploads/${folderName}/`;
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDirectory);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, Date.now() + ext);
        }
    });
}

function upload(folderName) {
    const storage = createStorage(folderName);

    return multer({
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
}

module.exports = {
    upload
};
