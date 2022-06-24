# dice-central
simple multiplayer TTRPG handler
- track characters (portraits, info, inventory, personal notes)
- roll dice
- shared file manager

## setup
1. `npm ci` or `npm install`
2. create `cfg.json` as
    ```json
    {
        "port": 8080,
        "dev": false
    }
    ```
3. make an [etherpad](https://github.com/ether/etherpad-lite) server
4. create `src/Hub/etherpadserver.json` and put the etherpad server's url in it (e.g. `"http://localhost:9001"`)
5. `cp -r defaultData data`
6. `npm run build-client`
7. `npm start`
8. password protect the web app

## dev
1. set `dev` in `cfg.json` to `true`
2. `npm run dev-client`
3. in a separate terminal, `nodemon`