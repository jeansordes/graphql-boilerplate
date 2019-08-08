# Sample for a GraphQL API

Just a simple boilerplate for a GraphQL api running on NodeJS

## Introduction

In `resolvers` and `schemas` you'll always find 2 files :
- `auth` : the part of the API that manages signup and login
- `api` : the actual api (the user needs to have a valid token for it to work, see below for more details)

## Is there any database ?

Yes, but a simple and lightweight one, go check `db_api.js` for more details.

## How to make request from the browser ?

```js
fetch('http://localhost:4000/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer here_goes_the_token_you_get_with__auth_login__'
    },
    body: JSON.stringify({
        query: `{ hello }`
    })
})
    .then(r => r.json())
    .then(console.log);
```