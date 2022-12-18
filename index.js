import dotenv from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

client.login(TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag} has logged in`);
});


const commands = [
    {
      name: 'help',
      description: 'Help command',
    },
  ];
  
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
