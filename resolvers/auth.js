const bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    fs = require("fs"),
    db = require("../src/json-db");

module.exports = {
    signup: ({ username, password }) => {
        if (db.doesUsernameExists(username)) {
            throw new Error("Username not available")
        } else {
            return bcrypt
                .hash(password, 10)
                .then(hash => {
                    return db.createNewUser(username, hash);
                })
                .catch(e => e);
        }
    },

    login: ({ username, password }) => {
        if (db.doesUsernameExists(username)) {
            let user_infos = db.getUserInfos(username);
            return bcrypt.compare(password, user_infos.password_hash)
                .then((isPasswordCorrect) => {
                    if (!isPasswordCorrect) return "Wrong password";

                    return jwt.sign({ uid: user_infos.uid, username: user_infos.username },
                        fs.readFileSync('./data/private.key', "utf8"),
                        { algorithm: "HS256", expiresIn: "1h" });
                })
        } else {
            throw new Error("Unknown user");
        }
    }
};
