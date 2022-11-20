const AwsSdk = require('aws-sdk');

class UtilitiesService{

    async uploadFileS3(nombre,archivo){
        try{
            const s3 = new AwsSdk.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_BUCKET_REGION
            });

            let params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: nombre,
                Body: archivo
            }

            let resp = await s3.upload(params).promise();
            let { Location } = resp;
            return Location;
        }catch(err){
            throw err;
        }
    }
}

module.exports = new UtilitiesService();