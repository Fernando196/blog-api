class AppResponse{
    constructor(code,data=null,errMsg=null){
        this.code   = code;
        this.data   = data;
        this.errMsg = errMsg;
        if(Number(code) >= 400){
            this.data = {
                'error': errMsg,
            };
        }
    }
}

module.exports = AppResponse;