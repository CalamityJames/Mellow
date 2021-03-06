const BotClient = require('./BotClient.js');
const WebServer = require('./WebServer.js');
const Database = require('./Database.js');
const { migrateALL } = require('./migration/migration.js');

const start = function () {
    migrateALL().then(() => {
        let bot;
        const webDatabase = new Database();
        const botConfig = webDatabase.webConfig.bot;
        if (botConfig && botConfig.token) {
            bot = new BotClient(webDatabase, botConfig.ownerid, botConfig.commandprefix);
            bot.init().catch((err) => {
                console.log('Failed initializing DiscordBot! Please check your bot settings.');
                console.error(err);
            });
        } else console.log('There is no bot token provided. Please check your settings!');
        new WebServer(webDatabase, bot).init();
    }).catch(console.error);
}

start();
