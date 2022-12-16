import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag} has logged in`);
});

client.on("messageCreate", (message) => {
    console.log(message.content);
    message.author.send(`${message.content}`);
});
