import multer, { diskStorage } from 'multer';
import { join } from 'path';
// Configure storage
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, 'public/assets'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${file.originalname}`;
        cb(null, filename);
        req.body.profilePicture = `public/assets/${filename}`; 
    }
});

// Set up multer with storage and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(join(__dirname, file.originalname).toLowerCase());

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png, gif)')); 
        }
    }
});

export default upload;
