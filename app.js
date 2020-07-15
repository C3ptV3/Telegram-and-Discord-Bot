const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config("default");
const axios = require("axios");
const ytdl = require("ytdl-core-discord");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.launch();

var channelimin;
const myfunc = function (message, callback) {
  axios
    .get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: message.content,
      },
    })
    .then(function (response) {
      callback(response.data.items[0].id.videoId);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
};

async function play(connection, url) {
  connection.play(await ytdl(url), { type: "opus" });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.cache
    .get(process.env.CHANNEL_ID)
    .join()
    .then((data) => {
      channelimin = data;
    })
    .catch((error) => console.log(error));
});

client.on("message", async (message) => {
  const connection = await message.member.voice.channel.join();
  myfunc(message, function (videoid) {
    play(connection, "https://www.youtube.com/watch?v=" + videoid);
  });
});
bot
  .on("message", (ctx) => {
    let messagetext = {};
    messagetext["content"] = ctx.update.message.text;
    myfunc(messagetext, function (videoid) {
      play(channelimin, "https://www.youtube.com/watch?v=" + videoid);
    });
  })
  .catch((error) => console.log(error));

client.on("error", (error) => console.log(error));

client.login(process.env.DISCORD_BOT_TOKEN);
