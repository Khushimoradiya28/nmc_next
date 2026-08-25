const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const LOCAL_MEDIA_PATH = process.env.LOCAL_MEDIA_PATH
    ? path.resolve(process.env.LOCAL_MEDIA_PATH)
    : path.join(__dirname, '../media');

let s3Client;
if (STORAGE_TYPE === 's3') {
    s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
}

const handleBase64Image = async (base64String, folderPath) => {
    const matches = base64String.match(/^data:(image\/.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) throw new Error('Invalid base64 image');

    const ext = matches[1].split('/')[1];
    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

    // Convert to webp
    const webpFileName = `${Date.now()}.webp`;
    const webpFilePath = path.join(folderPath, webpFileName);
    await sharp(filePath).toFormat('webp').toFile(webpFilePath);

    return {
        original: { filename: fileName, path: filePath },
        webp: { filename: webpFileName, path: webpFilePath },
    };
};

const fileUpload = (folderName = 'media') => {
    const localUploadPath = path.join(LOCAL_MEDIA_PATH, folderName);
    if (STORAGE_TYPE === 'local' && !fs.existsSync(localUploadPath))
        fs.mkdirSync(localUploadPath, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, localUploadPath),
        filename: (req, file, cb) => {
            const uniqueBase = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${uniqueBase}${ext}`);
        },
    });

    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) cb(null, true);
            else cb(new Error('Only image files are allowed!'), false);
        },
    });

    return (fieldName = 'media_file') => {
        return async (req, res, next) => {
            upload.single(fieldName)(req, res, async (err) => {
                if (err) return res.status(400).json({ status: 400, message: err.message });

                try {
                    if (!req.file) return next();

                    const originalPath = req.file.path;
                    const ext = path.extname(req.file.filename).toLowerCase();
                    const baseName = path.basename(req.file.filename, ext);

                    const webpFileName = `${baseName}.webp`;
                    const webpFilePath = path.join(localUploadPath, webpFileName);

                    // Convert to WebP
                    if (ext !== '.webp') {
                        await sharp(originalPath).toFormat('webp').toFile(webpFilePath);
                    } else {
                        fs.copyFileSync(originalPath, webpFilePath);
                    }

                    // Upload to S3 (v3 version)
                    if (STORAGE_TYPE === 's3' && s3Client) {
                        const uploadToS3 = async (filePath, fileName) => {
                            const fileContent = fs.readFileSync(filePath);

                            const command = new PutObjectCommand({
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: `${folderName}/${fileName}`,
                                Body: fileContent,
                                ContentType: 'image/' + path.extname(fileName).slice(1),
                                ACL: 'public-read',
                            });

                            await s3Client.send(command);
                            fs.unlinkSync(filePath);
                            return fileName;
                        };

                        await uploadToS3(originalPath, req.file.filename);
                        await uploadToS3(webpFilePath, webpFileName);
                    } else {
                        req.file.webpFile = webpFileName;
                    }

                    next();
                } catch (error) {
                    console.error('Error processing image:', error);
                    return res.status(500).json({ status: 500, message: 'Error processing image' });
                }
            });
        };
    };
};

module.exports = { fileUpload, handleBase64Image };
