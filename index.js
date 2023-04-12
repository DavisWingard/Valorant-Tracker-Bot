import dotenv from "dotenv";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
puppeteer.use(StealthPlugin());

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
      await interaction.reply('Enter /track, followed by your Riot ID name and Riot ID tag. If the bot does not respond, that means that the command was typed improperly, or blitz.gg recognizes the account as a private account.');
    }
    else if (interaction.commandName === 'track') {
      await interaction.reply('track text');
      console.log(interaction.options.getString('riotidname'));
      console.log(interaction.options.getString('riotidtag'));

      const link = "https://blitz.gg/valorant/profile/" + interaction.options.getString('riotidname') + "-" + interaction.options.getString('riotidtag') + "?queue=competitive";
      scrapeData(link);
    }
});

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

async function scrapeData(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);
  await delay(6000);

  const overviewElements = await page.$x('//*[@id="main-content"]/div[1]/div[1]/div/div[1]/a[1]')
  await overviewElements[0].click()

  const [el] = await page.$x('//*[@id="main-content"]/div[1]/div[1]/div/div[2]/div/div[1]/section[1]/div/div[2]/div[2]/div/div/p');
  const rankText = await el.getProperty("textContent");
  const rank = await rankText.jsonValue();

  console.log(rank);
}

