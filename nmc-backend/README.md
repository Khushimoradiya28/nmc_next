# RUNR Kids Backend

Backend API for RUNR Kids e-commerce platform.

## Tech Stack

- **Node.js**: v20.19.2
- **Express**: Web framework
- **MongoDB**: Database
- **AWS S3**: File storage
- **Multer**: File uploads
- **ExcelJS**: Excel file generation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   node server
   ```

## API Documentation

See [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information.