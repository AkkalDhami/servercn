import multer from "multer";

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "application/pdf"
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  console.log({ file });
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

export default upload;
