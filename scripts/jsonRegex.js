
module.exports = function validField(json,key,pattern){
    var reg = new RegExp(pattern,'g');
    var validReg = new RegExp(''+key+'[\\s\\S+?]:([^,}]*)','g');
    var jsonstr = '',matcharr,matchstr;
    try{
        jsonstr = JSON.stringify(json);
        matcharr = jsonstr.match(validReg);
        if(matcharr){
            matchstr = matcharr[0];
            matcharr = matchstr.split(':');
            if(matcharr.length>1){
                matchstr = matcharr[1];
                return reg.test(matchstr);
            }
            return false;
        }else {
            return false;
        }
    }catch(e){
        // 
        jsonstr = '';
    }
    return false;
};

// id: 0~100  --->  (^100$|(^[1-9][0-9]$)|^[0-9]$)
console.log("Find age which is less then 100:");
console.log('{"name":"chen","age":100} ', validField({"name":"chen","age":100},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
console.log('{"name":"chen","age":90} ', validField({"name":"chen","age":90},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
console.log('{"name":"chen","age":120} ', validField({"name":"chen","age":120},"age","(^100$|(^[1-9][0-9]$)|^[0-9]$)"));
