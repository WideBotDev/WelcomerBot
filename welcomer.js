/*

   Copyright 2023 Pratuz

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

-------------------

Dependencies: discord.js@^13.14.0

This bot will send a welcome message when a user joins the server and a leave message when a user leaves the server.

You have to install discord.js v13.14.0 or higher using 'npm install discord.js@^13.14.0'
in the terminal, then run the bot using 'node welcomer.js'.

Remember to insert your bot token and customize the welcome and leave messages.

*/

const Discord = require('discord.js');
const intents = Discord.Intents.FLAGS;
const client = new Discord.Client({
    autoReconnect: true, partials: ["CHANNEL"], intents: [intents.GUILDS,
    intents.GUILD_MEMBERS,
    intents.GUILD_INTEGRATIONS,
    intents.GUILD_PRESENCES,
    intents.GUILD_MESSAGES,
    intents.GUILD_MESSAGE_REACTIONS,
    intents.GUILD_MESSAGE_TYPING
    ]
});

//Change this to your bot token
const BOT_TOKEN = 'Insert your bot token here';

//Customize your welcome message
const WELCOME_CONFIG = {
    channel: 'Welcome', //Enter channel name or id
    messageContent: "Welcome to this server, {member-tag}",
    embed: {
        color: '#00ff00',
        title: 'Welcome!',
        description: 'Welcome to this server, {member-username}!',
        thumbnail: "{member-avatar}"
    }, 
}

//Customize your leave message
const LEAVE_CONFIG = {
    channel: 'Leave', //Enter channel name or id
    messageContent: "Bye bye, {member-tag}",
    embed: {
        color: '#ff0000',
        title: 'Bye bye!',
        description: 'The user {member-username} has left the server.',
        thumbnail: "{member-avatar}"
    }, 
}




function getReplaceVariables(member) {
    return {
        "{member-tag}": "<@" + member.id + ">",
        "{member-username}": member.user.username,
        "{member-avatar}": member.user.displayAvatarURL({ dynamic: true }),
    }
}

function replaceInObject(obj, replaceVariables) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            replaceInObject(obj[key], replaceVariables);
        } else if (typeof obj[key] === 'string') {
            for (let variable in replaceVariables) {
                obj[key] = obj[key].replace(variable, replaceVariables[variable]);
            }
        }
    }
}

client.on('ready', () => {
    console.log(`Bot connected as: ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
    const type = "GUILD_TEXT";
    if (typeof WELCOME_CONFIG.channel == "bigint" || typeof WELCOME_CONFIG.channel == "number") WELCOME_CONFIG.channel = WELCOME_CONFIG.channel.toString();
    const channel = member.guild.channels.cache.find((c) =>
        (c.name.toLowerCase() === WELCOME_CONFIG.channel.toLowerCase() || c.id === WELCOME_CONFIG.channel)
        && c.type.toLowerCase() === type.toLowerCase());
    if (!channel) return;
    if (!member.user.username) return;
    const welcomeConfigClone = JSON.parse(JSON.stringify(WELCOME_CONFIG));
    const replaceVariables = getReplaceVariables(member);
    replaceInObject(welcomeConfigClone, replaceVariables);
    const embed = new Discord.MessageEmbed(welcomeConfigClone.embed);
    if (welcomeConfigClone.embed.thumbnail) embed.setThumbnail(welcomeConfigClone.embed.thumbnail);
    const messageOptions = {
        content: welcomeConfigClone.messageContent,
        embeds: [embed]
    };
    channel.send(messageOptions);
});

client.on('guildMemberRemove', member => {
    const type = "GUILD_TEXT";
    if (typeof LEAVE_CONFIG.channel == "bigint" || typeof LEAVE_CONFIG.channel == "number") LEAVE_CONFIG.channel = LEAVE_CONFIG.channel.toString();
    const channel = member.guild.channels.cache.find((c) =>
        (c.name.toLowerCase() === LEAVE_CONFIG.channel.toLowerCase() || c.id === LEAVE_CONFIG.channel)
        && c.type.toLowerCase() === type.toLowerCase());
    if (!channel) return;
    if (!member.user.username) return;
    const leaveConfigClone = JSON.parse(JSON.stringify(LEAVE_CONFIG));
    const replaceVariables = getReplaceVariables(member);
    replaceInObject(leaveConfigClone, replaceVariables);
    const embed = new Discord.MessageEmbed(leaveConfigClone.embed);
    if (leaveConfigClone.embed.thumbnail) embed.setThumbnail(leaveConfigClone.embed.thumbnail);
    const messageOptions = {
        content: leaveConfigClone.messageContent,
        embeds: [embed]
    };
    channel.send(messageOptions);
});

client.login(BOT_TOKEN);
