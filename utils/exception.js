module.exports = {
    msg: function (code, descr, mess) {
       this.errorResp = {
            "code" : code,
            "description": descr,
            "error": mess
       };


        return this.errorResp;
    }
};