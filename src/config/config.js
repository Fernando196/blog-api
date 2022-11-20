process.env.SEED_API_BLOG = 'clase-secreta-blog';
process.env.PORT = 51000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


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