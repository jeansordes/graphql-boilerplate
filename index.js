const express = require("express"),
    graphqlHTTP = require("express-graphql"),
    { buildSchema } = require("graphql"),
    cors = require("cors"),
    fs = require("fs"),
    jwt = require("jsonwebtoken"),
    authRoot = require("./resolvers/auth"),
    apiRoot = require("./resolvers/api"),
    logerr = (...args) => console.log.apply(null, ["\x1b[31m%s\x1b[0m", ...args]);

if (!fs.existsSync("./data/private.key")) {
    logerr("⚠ 'data/private.key' was not found, please create it");
    if (!fs.existsSync("./data/private.key")) fs.mkdirSync("./data");
    process.exit();
}
const privateKey = fs.readFileSync('./data/private.key', "utf8");

const
    app = express(),
    customFormatErrorFn = (error) => ({
        message: error.message,
        stack: (process.env.NODE_ENV === "dev") && error.stack ? error.stack.split('\n') : undefined,
        path: error.path
    });

app.use(
    "/auth",
    cors(),
    graphqlHTTP({
        schema: buildSchema(fs.readFileSync("./schemas/auth.gql", "utf8")),
        rootValue: authRoot,
        graphiql: true,
        customFormatErrorFn
    })
);

app.use(
    "/api",
    cors(),
    (req, _, next) => { // check user's token
        let authHeader = req.header("Authorization");
        if (typeof authHeader === "undefined" || !authHeader.startsWith("Bearer ")) {
            req.err = new Error("Wrong Authorization header");
            next();
        }

        jwt.verify(authHeader.substr(7, authHeader.length), privateKey, { algorithms: "HS256" }, (err, decoded) => {
            // console.log(decoded);
            req.err = err;
            req.user = { infos: decoded };
            next();
        });
    },
    graphqlHTTP({
        schema: buildSchema(fs.readFileSync("./schemas/api.gql", "utf8")),
        rootValue: apiRoot,
        graphiql: true,
        customFormatErrorFn
    })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/api and http://localhost:4000/auth");