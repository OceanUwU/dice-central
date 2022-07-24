# dice-central
simple multiplayer TTRPG handler
- track characters (portraits, info, inventory, personal notes)
- roll dice
- shared file manager

## setup
1. `npm ci` or `npm install`
1. create `cfg.json` as
    ```json
    {
        "port": 8080,
        "randomWBOString": "hi",
        "dev": false
    }
    ```
1. in `cfg.json`, set `randomWBOString` to a random string of characters
1. make an [etherpad](https://github.com/ether/etherpad-lite) server
1. create `src/Hub/etherpadserver.json` and put the etherpad server's url in it (e.g. `"http://localhost:9001"`)
1. `cp -r defaultData data`
1. `npm run build-client`
1. `npm start`
1. password protect the web app

## dev
1. set `dev` in `cfg.json` to `true`
2. `npm run dev-client`
3. in a separate terminal, `nodemon`