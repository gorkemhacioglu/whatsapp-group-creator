// Import the necessary modules
const { chromium } = require('playwright');
const fs = require('fs').promises;

async function sendMessage() {
    // Launch the browser
    const browser = await chromium.launch({
        headless: false, // Set to true for headless mode, false to see the browser
    });

    const page = await browser.newPage();

    // Go to WhatsApp Web
    await page.goto('https://web.whatsapp.com');

    // Wait for 20 seconds to scan the QR code
    console.log("Please scan the QR code. Waiting for 20 seconds...");
    await page.waitForTimeout(10000);

    // Read the numbers and names from the txt file
    const contacts = await readContactsFromFile('contacts.txt');

    var i = 0;
    // Loop through each contact and send the message
    for (let contact of contacts) {
        const { name, phoneNumber, username, password } = contact;
        i++;
        await sendMessageToContact(page, name, phoneNumber, username, password, i, contacts.length);
    }

    // Close the browser
    await browser.close();
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

async function sendMessageToContact(page, name, phoneNumber, username, password, i, len) {
    try {
    const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(`Merhaba ${name}, Islak imzalı tutanak girişlerini bu adresten yapabilirsiniz, lütfen test için yükleme yapmayın. https://google.com Kullanıcı adı:${username} Şifre:${password}`)}`;
    await page.goto(whatsappURL);
    await page.waitForTimeout(200);
    await page.click('xpath=/html/body/div[1]/div/div/div[2]/div[4]/div/footer/div[1]/div/span[2]/div/div[2]/div[2]');
    await page.waitForTimeout(500);
    console.log(i + '/' + len + ' - ' + phoneNumber);
    } catch (error) {
    console.error('Error sending credentials the contacts file:', phoneNumber);
    }
}

sendMessage().then(() => console.log('Messages have been sent.'));
