## maptest bot

to setup (requires node.js):

* create a copy of example_config.json named config.json
* fill out empty values with correct values in config.json (token is discord token, cookie is .ROBLOSECURITY cookie, clientId is the bot's ID (right click bot in discord then choose copy ID with developer mode enabled))
* install dependencies
```
npm install
```
* register slash commands globally (this only needs to be ran once)
```
node deploy-commands.js
```
* run the bot
```
node bot.js
```

also, the bot requires the applications.commands scope, which can be found in developer portal -> bot -> oauth2 -> url generator -> scopes, simply generate link with applications.commands scope checked then add bot to server (can be done if bot already in server)