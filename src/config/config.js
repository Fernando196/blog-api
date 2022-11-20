process.env.PORT = 51000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// TOKEN
process.env.SEED_API_BLOG = 'clave-secreta-blog';
process.env.TOKEN_EXPIRATION = 60 * 60;

let dbData;

if( process.env.NODE_ENV === 'production' ){
    
    dbData = {
        databases: {
            blog:{
                username : 'admin',
                password : 'AzeCryHMjVdQ4',
                database : 'db_blog',
                options  : {
                    timezone: '-06:00',
                    host: 'db-challenge.cfpi6eqoszpg.us-east-2.rds.amazonaws.com',
                    port: 3306,
                    dialect: 'mysql',
                    dialectOptions: { 
                        decimalNumbers: true
                    }
                }
            }
        }
    }
}else{
    dbData ={
        databases: {
            blog:{
                username : 'admin',
                password : 'AzeCryHMjVdQ4',
                database : 'db_blog',
                options  : {
                    timezone: '-06:00',
                    host: 'db-challenge.cfpi6eqoszpg.us-east-2.rds.amazonaws.com',
                    port: 3306,
                    dialect: 'mysql',
                    dialectOptions: { 
                        decimalNumbers: true
                    }
                }
            }
        }
    }
}

process.env.DBDATA = JSON.stringify(dbData);

// AWS

process.env.AWS_BUCKET_NAME   = "image-app-node";
process.env.AWS_BUCKET_REGION = 'us-east-2';
process.env.AWS_ACCESS_KEY    = 'AKIAUCHPHZUVCGWGOVFE';
process.env.AWS_SECRET_KEY    = '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';

// AWS FOLDER

process.env.AWS_IMAGES_FOLDER = 'node/image/';