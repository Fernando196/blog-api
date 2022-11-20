const multer = require('multer');

const memoryStorage = multer.memoryStorage({})
const memoryUpload  = multer({ memoryStorage });

module.exports = {
    memoryUpload
}