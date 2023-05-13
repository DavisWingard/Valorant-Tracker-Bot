import dotenv from "dotenv";
import { Client, DiscordAPIError, GatewayIntentBits, Message, messageLink, REST, Routes } from "discord.js";
import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import Discord from 'discord.js';
import { EmbedBuilder } from "@discordjs/builders";
puppeteer.use(StealthPlugin());

dotenv.config();
var user;
var output;

async function scrapeData(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);
  await delay(2000);

  const overviewElements = await page.$x('//*[@id="main-content"]/div[1]/div[1]/div/div[1]/a[1]')
  await overviewElements[0].click()

  const [el] = await page.$x('//*[@id="main-content"]/div[1]/div[1]/div/div[2]/div/div[1]/section[1]/div/div[2]/div[2]/div/div/p');
  const rankText = await el.getProperty("textContent");
  const rank = await rankText.jsonValue();

  const [el2] = await page.$x('//*[@id="main-content"]/div/div[1]/div/div[2]/div/div[2]/section/div[1]/div[1]/div[3]/h4');
  const kdText = await el2.getProperty("textContent");
  const kd = await kdText.jsonValue();

  const [el3] = await page.$x('//*[@id="main-content"]/div/div[1]/div/div[2]/div/div[1]/section[1]/div/div[3]/div[3]/p[2]');
  const headshotText = await el3.getProperty("textContent");
  const headshot = await headshotText.jsonValue();

  const [el4] = await page.$x('//*[@id="main-content"]/div/div[1]/div/div[2]/div/div[2]/section/div[1]/div[1]/div[2]/h4');
  const winrateText = await el4.getProperty("textContent");
  const winrate = await winrateText.jsonValue();

  const [el5] = await page.$x('//*[@id="main-content"]/div[1]/div[1]/div/div[2]/div/div[1]/section[3]/div/div[1]/li[1]/a/div[1]/p[1]');
  const topagentText = await el5.getProperty("textContent");
  const topagent = await topagentText.jsonValue();

  output = "Rank: " + rank + "\nK/D: " + kd + "\nHeadshot: " + headshot + "\nWin Rate: " + winrate + "\nTop Agent: " + topagent;
  await browser.close();
  return output;
}

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
      await interaction.deferReply();
      const link = "https://blitz.gg/valorant/profile/" + interaction.options.getString('riotidname') + "-" + interaction.options.getString('riotidtag') + "?queue=competitive";
      user = interaction.options.getString('riotidname') + "#" + interaction.options.getString('riotidtag');
      await scrapeData(link);
      console.log(output)

      const embed = new EmbedBuilder()
         .setTitle(user)
         .setDescription(output)

      await interaction.editReply({ embeds: [embed] })
    }
});

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
  