const multer = require('multer');
const path = require('path');

// ------------------------------------------------------------------------------------------------------- //
// configurage storge
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'))
    },
    filename: (req, file, cb) => { 
        cb(null, file.originalname)
    },
    fileFilter: (req, file, cb) =>{
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            cb(null, true)
        }else{
            cb(null, false)
        }
    }
})


let upload = multer({storage:storage});

module.exports = upload;