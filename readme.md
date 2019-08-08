# GraphQL API Boilerplate

Just a simple boilerplate for a GraphQL API running with NodeJS (Go check https://www.google.com/search?q=introduction+to+graphql for an introduction to GraphQL)

## How to install it

You will need to have **Node.JS** and **git** installed, then :

- Clone this repo unto your computer (`git clone https://github.com/jeansordes/graphql-boilerplate.git`)
- Install dependencies (`npm install`)
- Once done, run `npm run dev` or `npm run prod` (go check `package.json` for more details on the scripts used)

On your first run, the server will create a `data` folder and it will tell you it needs a `private.key` to be created in this new folder.

- Then, go to http://localhost:4000/auth and signup your first user (`mutation { signup (username: "John Doe", password: "a strong password") }`). This will return you your user ID (it will be "2" because there is already a user in the database : root)

**This last step creates a file that serves as a database** (`data/db_data.json`), go check `db_api.js`, especially the functions `pull` and `push`, to understand how the database works. You are strongly encouraged to customize this file in order to use a more reliable database (like postgresql or mongoDB for instance)

- You can then login (`{ login (username: "John Doe", password: "a strong password") }`) to get your Json Web **Token** (Go check https://jwt.io for more information)
- And now you are ready to query `{ hello }` on http://localhost:4000/api ⚠ **Warning** : You need to include your token in the header for the request to work, check the next section to see how

## How to make request from the browser ?

Open the DevTools (F12 in most browsers) and copy paste the code below in the JS Console (don't forget to edit the "Autorization" header)

```js
fetch("http://localhost:4000/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer here_goes_the_token_you_get_with__auth_login__"
  },
  body: JSON.stringify({ query: `{ hello }` })
})
  .then(r => r.json())
  .then(console.log); // { data: {hello: "Hello world !"}}
```
