# How to run the app

 ### In terminal, run:
 1. `npm i`
 2. `npm run devStart`
 3. In a separate terminal run `mongosh`


# Insomnia Guide

In the Insomnia collection, the requests are organized chronologically from top to bottom.

### Getting Started
1. Copy the `accessToken` into the Bearer token auth section.

### User Operations
- Create a new user:
  - Use the format inside the create new user endpoint.

- Log in as the created user:
  - Don't forget to copy the `accessToken`.

- Get all users (verify):
  - *Optional:* Just for debugging purposes.

### List Operations
- Create a new list:
  - Use the format inside the create new list endpoint.

- Get a specific list:
  - Don't forget to copy the newly created list's ID. Format: `http://localhost:3000/lists/---_id---` (_id = listId)

- Get all available lists:
  - Use the following endpoint with the correct bearer token: `http://localhost:3000/lists`

- Patch/Update a specific list:
  - Takes in JSON, the Bearer token, and lisId inside the URL.

- Delete a specific List:
  - listId inside the URL and correct bearer token.
