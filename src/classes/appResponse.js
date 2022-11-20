class AppResponse{
    constructor(code,data=null,msg = null){
        this.code   = code;
        this.data   = data;
        this.msg    = msg;
        if(Number(code) === 200){
            this.data = {
                estatus: 'done',
                msg    : this.msg,
                data   : this.data
            }
            if(!data) delete this.data.data;
            if(!msg)  delete this.data.msg;
        }
        if(Number(code) >= 400){
            this.data = {
                estatus : 'error',
                msg     : this.msg
            };
        }
    }
}

module.exports = AppResponse;