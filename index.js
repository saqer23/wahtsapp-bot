const express = require('express')
const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');


const app = express();

app.get('/', (req, res) => {
    try {
        console.log('here');
        const client = new Client({
            puppeteer: {
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            }
        });
        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });
        client.on('ready', () => {
            console.log('Client is ready!');
        });
        client.on('message', async msg => {
            try {
                if (!msg.body.includes(" ")) {
                    const media = await MessageMedia.fromUrl(`https://api.esharat.shi.org.sa/files/${msg.body}.mp4`);
                    client.sendMessage(msg.from, media);
                    let mesgCover = "*هلا والله نورت مكتبة لغة الإشارة السعودية إبحث عن اي مصطلح إشاري*"
                    client.sendMessage(msg.from, mesgCover);
                } else {
                    let fileUrl = "https://api.esharat.shi.org.sa/files/" + msg.body.replace(/ /g, "%20") + ".mp4";
                    const media = await MessageMedia.fromUrl(fileUrl);
                    client.sendMessage(msg.from, media);
                    let mesgCover = "*هلا والله نورت مكتبة لغة الإشارة السعودية إبحث عن اي مصطلح إشاري*"
                    client.sendMessage(msg.from, mesgCover);
                }
            } catch (error) {
                let errorMessage = `حدث خطأ 
                ${error}
                `
                client.sendMessage(msg.from, errorMessage);
            }
        });
        client.initialize();
        return res.json({
            mess: "hi"
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(8080, () => {
    console.log('run server');
})