const Discord = require("discord.js");
const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const path = require("path");
const nodeHtmlToImage = require("node-html-to-image");
const config = require("./config.json");

const app = express();
const port = 3000;

// Define constants for strings
const FIRSTAUTHORURL = "FIRSTAUTHORURL";
const THEFIRSTAUTHOR = "THEFIRSTAUTHOR";
const SECONDAUTHORURL = "SECONDAUTHORURL";
const THESECONDAUTHOR = "THESECONDAUTHOR";
const RESPONSETONITRO = "RESPONSETONITRO";
const FIRSTAUTHORDATE = "Today at ";
const SECONDAUTHORDATE = "Today at ";

async function nitrogenerator(e, t) {
  let a = formatAMPM(new Date());
  let n = formatAMPM(new Date(Date.now() - 60000));
  let o = await fs.readFileSync(`${__dirname}/testing.html`, "utf8");
  let datatosend = o;

  datatosend = datatosend.replace(FIRSTAUTHORURL, e.author.displayAvatarURL());
  datatosend = datatosend.replace(THEFIRSTAUTHOR, e.author.username);
  datatosend = datatosend.replace(SECONDAUTHORURL, client.users.cache.random().displayAvatarURL());
  datatosend = datatosend.replace(THESECONDAUTHOR, t.shift());
  datatosend = datatosend.replace(RESPONSETONITRO, t.join(" "));
  datatosend = datatosend.replace(FIRSTAUTHORDATE, FIRSTAUTHORDATE + n);
  datatosend = datatosend.replace(SECONDAUTHORDATE, SECONDAUTHORDATE + a);

  app.get("/font", function (req, res) {
    const fontPath = `${__dirname}/Whitneyfont.woff`;
    res.sendFile(fontPath);
  });

  app.get("/", function (req, res) {
    res.send(datatosend);
  });

  let server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);
  await page.waitForSelector(".scrollerInner-2YIMLh");
  const element = await page.$(".scrollerInner-2YIMLh");
  let screenshot = await element.screenshot({ type: "png" });
  await browser.close();

  const attachment = new Discord.MessageAttachment(screenshot, "NitroProof.png");
  e.channel.send(`${e.author}`, attachment);

  server.close();
}

function formatAMPM(e) {
  var hours = e.getHours();
  var minutes = e.getMinutes();
  var period = hours >= 12 ? "PM" : "AM";
  hours = (hours %= 12) || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + period;
}

const client = new Discord.Client();

client.on("ready", () => {
  function randomStatus() {
    let statusOptions = [
      "Infinite Codes In Stock",
      "Generating Codes",
      "Stealing Emojis",
      "Invite Me: !invite",
      "! “ⲘrṨhส∂ow.🌙♡#0001 Is My Dad",
    ];

    let randomIndex = Math.floor(Math.random() * statusOptions.length);
    client.user.setActivity(statusOptions[randomIndex], {
      type: "PLAYING",
      url: "https://solo.to/mrshadowdev",
    });
  }

  setInterval(randomStatus, 5000);

  console.log("Online.");
});

client.on("message", async (message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "classic") {
    await nitrogenerator(message, args);
  }
});

client.login(config.token);
