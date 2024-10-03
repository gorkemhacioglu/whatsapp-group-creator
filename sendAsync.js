const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function sendMessageWithBrowser(contacts) {
    const browser = await chromium.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');
    console.log("Please scan the QR code. Waiting for 20 seconds...");
    await page.waitForTimeout(40000); // Wait for QR code scan

    var i = 0;
    for (let contact of contacts) {
        const { name, phoneNumber, username, password } = contact;
        i++;
        await sendMessageToContact(page, name, phoneNumber, username, password, i);
    }

    await browser.close();
}

async function sendMessage() {
    const contacts = await readContactsFromFile('contacts.txt');
    const parts = splitIntoParts(contacts, 4); // Divide contacts into 4 parts

    // Create a promise for each part and run them concurrently
    await Promise.all(parts.map(part => sendMessageWithBrowser(part)));

    console.log('Messages have been sent.');
}

async function readContactsFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        return data.split('\n').map(line => {
            const [name, phoneNumber, username, password] = line.split(';');
            return { name, phoneNumber, username, password };
        });
    } catch (error) {
        console.error('Error reading the contacts file:', error);
        return [];
    }
}

async function sendMessageToContact(page, name, phoneNumber, username, password, i) {
    try {
    const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(`Merhaba ${name}, Islak imzalı tutanak girişlerini bu adresten yapabilirsiniz, lütfen test için yükleme yapmayın. https://google.com Kullanıcı adı:${username} Şifre:${password}`)}`;
    await page.goto(whatsappURL);
    await page.waitForTimeout(500);
    await page.click('xpath=/html/body/div[1]/div/div/div[2]/div[4]/div/footer/div[1]/div/span[2]/div/div[2]/div[2]');
    await page.waitForTimeout(600);
    console.log(i + ' - ' + phoneNumber);
    } catch (error) {
        console.error(`Error sending credentials the contacts file: ${name};${phoneNumber};${username};${password}`);
        try {
        await fs.appendFile(path.join(__dirname, 'fail.txt'), `${name};${phoneNumber};${username};${password}\n`);
        } catch (err) 
        { 
            console.error(`File writing error: ${name};${phoneNumber};${username};${password}`);
        }
    }
}

function splitIntoParts(array, parts) {
    let result = [];
    for (let i = 0; i < parts; i++) {
        result.push(array.slice(i * Math.ceil(array.length / parts), (i + 1) * Math.ceil(array.length / parts)));
    }
    return result;
}

sendMessage().then(() => console.log('All messages have been sent.'));
