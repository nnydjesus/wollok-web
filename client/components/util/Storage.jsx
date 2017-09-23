class Storage {
    constructor(user) {
        this.user = user;
        this.userHash = Storage._hashCode(user);
    }

    set = (key, obj) => {
        if (typeof window !== "undefined" && Storage._storageAvailable("localStorage")) {
            var userKey = this.userHash + "-" + key;
            localStorage.setItem(userKey, JSON.stringify(obj));
        }
    };

    get = (key) => {
        if (typeof window !== "undefined" && Storage._storageAvailable("localStorage")) {
            try {
                var userKey = this.userHash + "-" + key;
                return JSON.parse(localStorage.getItem(userKey));
            } catch (e) {
                return null;
            }
        }
        return undefined;
    };

    remove = (key) => {
        if (typeof window !== "undefined" && Storage._storageAvailable("localStorage")) {
            var userKey = this.userHash + "-" + key;
            localStorage.removeItem(userKey);
        }
    };

    has = (key) => {
        var value = this.get(key);
        return (value !== null && value !== undefined);
    };
}

Storage._storageAvailable = (type) => {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return false;
    }
};

Storage._hashCode = (string) => {
    var hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

Storage.keys = {
    APPLIED_FILTER: "applied_filter"
};

export default Storage;