require("dotenv").config();

const COLOR = 5814783;
const footer = {
    'color': 5814783,
    'footer': {
        'text': 'Built by ruuffian',
        'icon_url': 'https://i.imgur.com/ntBDWzO.png' },
};
const webhooks = {
  "economy": process.env.ECONOMY_URL,
  "commercial": process.env.COMMERCIAL_URL,
  "financial": process.env.FINANCIAL_URL,
  "executive": process.env.EXECUTIVE_URL,
}
exports.messageBuilder = (req, res) => {
    const body = req.body;
    const response = body.data;
    try {
    // Build match history message
        const msg = {};
        const embeds = [];
        // Extract basic game info
        const league = response[0];
        const tag = response[1];
        const winTag = response[2];
        const loseTag = response[3];
        const wins = response[4];
        const losses = response[5];
        // Construct beginning of message
        const base = `**${league}**\n${winTag} ${wins} - ${losses} ${loseTag}\nSubmitted by: \`${tag}\``;
        msg['content'] = base;
        // Handle ff
        const ff = response[6];
        if (ff == 'Yes') {
            msg['content'] = `${msg['content']}\nBy FF.`;
        }
        else {
            // Extract per-game data
            let next = true;
            let count = 1;
            let offset = 7;
            while (next) {
            // Extract data
            // const gameid = response[0 + offset];
                const draft = response[1 + offset];
                const postgame = response[2 + offset];
                const notes = response[3 + offset];
                const game = {
                    'title': `Game ${count}`,
                    'description': `[Draft Link](${draft})\nNotes: ${notes}`,
                    'color': COLOR,
                    'image': {
                        'url': `${postgame}`,
                    },
                };
                embeds.push(game);
                // Continue if there are more games
                const nextGame = response[4 + offset];
                next = nextGame == 'Yes' ? true : false;
                offset += 5;
                count++;
            }
        }
        // Add footer
        footer.timestamp = new Date().toISOString();
        embeds.push(footer);
        msg['embeds'] = embeds;
        // Last details
        msg['username'] = 'Match History';
        msg['avatar_url'] = 'https://i.imgur.com/bFz60J2.jpg';
        msg['attachments'] = [];

        // Build cloud function payload
        const webhookId = league.split(' ')[0];
        // Send payload to match history handler
        (async () => {
            const status = await fetch(webhooks[webhookId.toLowerCase()], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(msg),
            });
            console.log(`POSTed message with status: ${status}`);
        })();
        res.status(200).send();
    }
    catch (e) {
        res.status(500);
        console.log(e);
        return;
    }
};

