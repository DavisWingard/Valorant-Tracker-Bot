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

const commands = [
    {
      name: 'help',
      description: 'Help command',
    },
    {
      name: 'track',
      description: 'Track command',
      options: [{
        name: 'riotidname',
        description: 'riod id name',
        type: 3,
        required: true,
      },
      {
        name: 'riotidtag',
        description: 'riod id tag',
        type: 3,
        required: true,
      },
      {
        name: 'agent',
        description: 'agent',
        type: 3,
        required: true,
      },
      ],
    },
];

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

client.login(TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
  
const rest = new REST({ version: '10' }).setToken(TOKEN);
  
(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'help') {
      await interaction.reply('Enter /track, followed by your Riot ID name, Riot ID tag, and the agent you wish to see stats for');
    }
    else if (interaction.commandName === 'track') {
      await interaction.reply('track text');
      console.log(interaction.options.getString('riotidname'));
      console.log(interaction.options.getString('riotidtag'));
      console.log(interaction.options.getString('agent'));
    }
});
