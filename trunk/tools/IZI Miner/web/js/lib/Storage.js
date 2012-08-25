var Storage = new Class({

    get: function(key) {
        return localStorage.getItem(key);
    },

    getObj: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    set: function(key, data) {
        localStorage.setItem(key, data);
    },

    setObj: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

});