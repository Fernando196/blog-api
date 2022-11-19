class AppResponse{
    constructor(code,data=null,errMsg=null){
        this.code   = code;
        this.data   = data;
        this.errMsg = errMsg;
        if(Number(code) >= 400){
            this.err = true;
        }else{
            this.err = false
        }
    }
}

module.exports = AppResponse;