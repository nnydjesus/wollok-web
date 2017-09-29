var removeComments = function (str) {
    var re_comment = /(\/[*][^*]*[*]\/)|(\/\/[^\n]*)/gm;
    return ("" + str).replace(re_comment, "");
};
var getOnlyBrackets = function (str) {
    var re = /[^()\[\]{}]/g;
    return ("" + str).replace(re, "");
};
var areBracketsInOrder = function (str) {
    str = "" + str;
    var bracket = {
        "]" : "[",
        "}" : "{",
        ")" : "("
    },
    openBrackets = [],
    isClean = true,
    i = 0,
    len = str.length;
    
    for (; isClean && i < len; i++) {
        if (bracket[str[i]]) {
            isClean = (openBrackets.pop() === bracket[str[i]]);
        } else {
            openBrackets.push(str[i]);
        }
    }
    return isClean && !openBrackets.length;
};
var isBalanced = function (str) {
    str = removeComments(str);
    str = getOnlyBrackets(str);
    return areBracketsInOrder(str);
}

export default {
    addContextInfo: function(exception){
        if(exception.expected.find(error=> error.text == "}")){
            exception.message = "Te Falta cerrar la }"
        }
        return exception
    }
}