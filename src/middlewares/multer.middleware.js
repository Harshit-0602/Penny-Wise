import multer from "multer";

// const Storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./Images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({
//     storage: Storage,
// });

const upload = multer();

export { upload };