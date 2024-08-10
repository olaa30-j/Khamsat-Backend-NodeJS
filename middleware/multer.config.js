import multer, { diskStorage } from 'multer';
import { join } from 'path';

// ------------------------------------------------------------------------------------------------------- //
// configurage storge
let storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, 'static/images'))
    },
    filename: (req, file, cb) => { 
        cb(null, file.originalname)
        req.body.profile_picture_url = `static/images/${file.originalname}`
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

export default upload;