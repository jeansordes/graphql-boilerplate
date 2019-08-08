module.exports = {
    hello: (_, req) => {
        if (req.err) throw req.err;

        return "Hello world !";
    }
}