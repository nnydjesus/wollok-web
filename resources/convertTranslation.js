const toCsv = function() {
    fs = require('fs');
    fs.readFile("translation.json", "utf8", function(err, data) {
        let translation = JSON.parse(data);
        let languages = [];
        let keys = [];
        let keyValues = {};
        for (let l in translation) {
            languages.push(l);
            let language = translation[l];
            for (let i in language) {
                let key = i;
                if (language.hasOwnProperty(i)) {
                    if (typeof language[i] === "string") {
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                        }
                        let keyValue = keyValues[key] ? keyValues[key] : {};
                        keyValue[l] = language[i];
                    } else {
                        
                    }
                }
            }
        }
        console.log(keyValues);
    });
};

export default { toCsv };