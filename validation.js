
module.exports = {
    checkUsername(username) {
        if (!username) throw "must provide username"
        if (typeof username !== "string")
            throw "Error: username should be a string";
        if (username.indexOf(" ") >= 0)
            throw "Error: username should not have any spaces";
        username = username.trim();
        if (username.length < 4)
            throw "Error: username must have at least four characters";
        //check for alphnumeric 
        //https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript

        for (let i = 0; i < username.length; i++) {
            let code = username.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                throw "username must have only alphanumeric characters"
            }
        }

        return username;
    },

    checkPassword(password) {
        if (!password) throw "must provide password"
        if (typeof password !== "string")
            throw "Error: password should be a string";
        if (password.indexOf(" ") >= 0)
            throw "Error: password should not have any spaces";
        password = password.trim();
        if (password.length < 6)
            throw "Error: password must have at least eight characters";
        return password;
    },

    checkId(id) {
        if (!id) throw "must provide s"
        if (typeof id !== 'string') throw 'invalid string input';
        if (id.trim().length === 0)
            throw 'Id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'invalid object ID';

        return id;
    },


    checkString(string) {
        if (!string) throw "must provide text input"
        if (typeof string !== 'string') throw 'invalid string input';
        if (string.trim().length === 0)
            throw 'string cannot be an empty string or just spaces';
        return string;
    },

    checkWebsite(website) {
        if (!website) throw "must provide store link"
        if (typeof website !== 'string') throw 'invalid website input';
        if (website.trim().length === 0)
            throw 'Id cannot be an empty website or just spaces';
        if (!website.includes('https://www.') && !(website.includes('http://www.')) ) throw 'invalid website'
        //end

        if (website.slice(website.length - 4, website.length) !== '.com') throw 'invalid website'
        //middle\\
        //console.log(website.slice(website.length - 4, website.length))
        site = website.indexOf('http://www.') + 11
        if (website.slice(site, -4).length < 2) throw 'invalid website input'


        return website;
    }
};