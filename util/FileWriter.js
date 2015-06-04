var fs = require('fs');

module.exports = {
    write:function(res){
        fs.writeFile('scrap.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        });
    }
}

module.exports = {
    print: function (res) {
        return JSON.stringify(res,null,2);
    }
};