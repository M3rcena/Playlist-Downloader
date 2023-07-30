require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { PlaylistDownloader } = require('yt-playlist-downloader');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
})

client.on('interactionCreate', (interaction) => {
    if (interaction.commandName === 'download') {
        const playlist_url = interaction.options.getString('url');
        const max_parallel_downloads = 4;
        const output_folder = './src/music'
        const playlist_size_limit = Infinity;
        interaction.reply('The playlist is been downloaded');

        const pldl = new PlaylistDownloader(
            playlist_url,
            max_parallel_downloads,
            output_folder,
            playlist_size_limit
        );

        pldl.download().then(() => {
            console.log('Done')
        }).catch((err) => {
            console.log(err)
        });

        pldl.on('status_changed', (status) => {
            console.log(status)
        })
    }
})

// HANDLE EVENTS
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);