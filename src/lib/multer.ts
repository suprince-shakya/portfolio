import multer from "multer";

const storage = multer.memoryStorage(); // ✅ Store file in memory (RAM)

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

export { upload };
