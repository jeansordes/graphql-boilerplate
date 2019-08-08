const
    express = require("express"),
    graphqlHTTP = require("express-graphql"),
    { buildSchema } = require("graphql"),
    cors = require("cors"),
    fs = require("fs"),
    jwt = require("jsonwebtoken"),
    { fileLoader, mergeTypes, mergeResolvers } = require("merge-graphql-schemas"),

    globalResolver = mergeResolvers(fileLoader("./resolvers")),
    globalSchema = buildSchema(mergeTypes(fileLoader("./schemas"), { all: true })),
    logerr = (...args) => console.log.apply(null, ["\x1b[31m%s\x1b[0m", ...args]),
    privateKey = fs.readFileSync('./data/private.key', "utf8"),
    app = express();

if (!fs.existsSync("./data/private.key")) {
    logerr("⚠ 'data/private.key' was not found, please create it\n(Quick help : https://www.google.com/search?q=hs256+key+generator)");
    if (!fs.existsSync("./data/private.key")) fs.mkdirSync("./data");
    process.exit();
}

app.use(
    "/api",
    cors(),
    (req, _, next) => { // check user's token
        let authHeader = req.header("Authorization");
        if (typeof authHeader === "undefined" || !authHeader.startsWith("Bearer ")) {
            req.err = new Error("Wrong Authorization header");
            next();
        } else {
            jwt.verify(authHeader.substr(7, authHeader.length), privateKey, { algorithms: "HS256" }, (err, decoded) => {
                req.err = err;
                req.user = { infos: decoded };
                next();
            });
        }
    },
    graphqlHTTP({
        schema: globalSchema,
        rootValue: globalResolver,
        graphiql: true,
        customFormatErrorFn: err => ({
            message: err.message,
            stack: (process.env.NODE_ENV === "dev") && err.stack ? err.stack.split('\n') : undefined,
            path: err.path
        })
    })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/api");