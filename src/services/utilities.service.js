const AwsSdk = require('aws-sdk');
const s3 = new AwsSdk.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION
});

class UtilitiesService{

    async uploadFileS3(nombre,archivo){
        try{
            let folder = process.env.AWS_IMAGES_FOLDER;
            let params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${folder}${nombre}`,
                Body: archivo
            }

            let resp = await s3.upload(params).promise();
            let { Location } = resp;
            return Location;
        }catch(err){
            throw err;
        }
    }

    async deleteFileS3(nombre){
        try{
            let folder   = process.env.AWS_IMAGES_FOLDER;
            let params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key   : `${folder}${nombre}`
            }

            await s3.deleteObject(params).promise();
            return true
            
        }catch(err){
            return false
        }
    }
}

module.exports = new UtilitiesService();