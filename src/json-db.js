const
    fs = require("fs"),
    db_path = "./data/db-data.json";

const
    pull = () => {
        if (!fs.existsSync(db_path)) {
            if (!fs.existsSync("./data")) fs.mkdirSync("./data");

            return {
                userTable: [
                    { uid: 1, username: "root", password_hash: "" }
                ]
            };

        }
        return JSON.parse(fs.readFileSync(db_path, { encoding: "utf8" }));
    },
    push = (o) => {
        fs.writeFileSync(db_path, JSON.stringify(o, null, 4), { encoding: "utf8" });
    }

const
    createNewUser = (username, password_hash) => {
        let data = pull();
        push({ ...data, userTable: [...data.userTable, { uid: (data.userTable.length + 1), username, password_hash }] });
        return data.userTable.length + 1;
    },
    getUserInfos = username => {
        let data = pull();
        return data.userTable.find(user => user.username.toLowerCase() == username.toLowerCase());
    },
    doesUsernameExists = username => {
        return typeof getUserInfos(username) !== "undefined";
    };

module.exports = {
    createNewUser,
    getUserInfos,
    doesUsernameExists
}

/*
// Postgresql boilerplate
const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "my_db", // createdb -U postgres my_db
    password: "root",
    port: 5432
});
client.connect();

process.on("exit", () => client.end());
process.on("uncaughtException", () => client.end());
*/
