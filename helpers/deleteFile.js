const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted photo: ${filePath}`);
    } else {
        console.log(`Photo topilmadi: ${filePath}`);
    }
};

module.exports = deleteFile;