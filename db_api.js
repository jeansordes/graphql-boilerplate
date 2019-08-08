const
    fs = require("fs"),
    db_path = "./data/db_data.json";

const
    pull = () => {
        if (!fs.existsSync(db_path)) {
            if (!fs.existsSync("./data")) fs.mkdirSync("./data");

            return {
                userTable: [
                    { uid: 1, username: "root", password_hash: "$2y$10$Z5BrpS9WnD0umIXnsVXlR.8wHzZco.jgxvumbS7yaxKJ3r08YDoJy" }
                ]
            }; // only user is root, its password is root

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
    database: "tifod",
    password: "root",
    port: 5432
});
client.connect();

process.on("exit", () => client.end());
process.on("uncaughtException", () => client.end());
*/