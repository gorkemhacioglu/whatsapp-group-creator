const { chromium } = require('playwright');
const fs = require('fs').promises; // Import the file system module
const os = require('os'); // Import the OS module to get the user's home directory

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function navigateToWhatsApp(firstMemberName, firstMemberNumber, timeout) {

    const groupNameFile = 'groupNames.txt';
    fileContent = '';

    try {
        // Check if the file exists
        await fs.access(groupNameFile);

        // If the file exists, read its content
        fileContent = await fs.readFile(groupNameFile, 'utf-8');
    } catch (error) {
        // Handle the case where the file does not exist
        console.error(`File "${groupNameFile}" does not exist. Create and fill it by adding one group name to each line`);
        return;
    }

    if (fileContent == undefined || fileContent == '') {
        console.warn('Please fill the groupNames.txt\r\nAdd one group name to each line');
        return;
    }

    // Split the content into an array of group names
    const groupNames = fileContent.trim().split('\n');

    const homeDirectory = os.homedir();

    const userDataPath = `${homeDirectory}\\AppData\\Local\\Google\\Chrome\\User Data`;

    const browser = await chromium.launchPersistentContext(userDataPath, {
        headless: false, // Set to true for headless mode, false to see the browser
    });

    const page = await browser.newPage();

    await page.goto('https://web.whatsapp.com/');

    await page.waitForTimeout(10000);

    // Wait for user to login and load the page
    await page.waitForSelector('span[data-icon="menu"]');

    const groupLinks = [];

    for (const groupName of groupNames) {

        let success = false;

        while (!success) {
            try {
                // Click on options icon
                await page.click('span[data-icon="menu"]');

                // Click on "New group" option
                await page.waitForSelector('div[aria-label="New group"]');
                await page.click('div[aria-label="New group"]');

                // Type the phone number to add to the group
                await page.type('input[placeholder="Search name or number"]', firstMemberNumber);

                // Select the contact
                await page.waitForSelector('div._8nE1Y');
                await page.click('div._8nE1Y');

                // Click on the "Next" button
                await page.waitForSelector('div[aria-label="Next"]');
                await page.click('div[aria-label="Next"]');

                // Give a name to the group
                await page.type('div[contenteditable="true"]', groupName);

                // Click on the "Create" button
                await page.waitForSelector('div[aria-label="Create group"]');
                await page.click('div[aria-label="Create group"]');

                //Click on group menu
                await page.click('.kiiy14zj');

                // Click on "Group info"
                await page.waitForSelector('div[aria-label="Group info"]');
                await page.click('div[aria-label="Group info"]');

                // Right click on a group member
                await page.waitForSelector('span[title="'+firstMemberName+'"]');
                await page.click('span[title="'+firstMemberName+'"]', { button: 'right' });

                // Click on "Make group admin"
                await page.waitForSelector('div[aria-label="Make group admin"]');
                await page.click('div[aria-label="Make group admin"]');

                // Click on confirm
                await page.click('text="Make group admin"');

                // Click on share
                await page.click('.\\_21S-L:text("Invite to group via link")');

                //Get link
                const linkElement = await page.waitForSelector('span.ovllcyds.e1gr2w1z.o0rubyzf');

                const link = await linkElement.innerText();

                // Get the text content of the element (which should be the link)
                groupLinks.push({ groupName: groupName.trim(), link });

                // Write the current group name and link to the file
                await fs.appendFile('linksOutput.txt', `${groupName.trim()};${link}\n`);

                success = true;

                //Close "X is now admin" message
                /*await page.waitForSelector('span[data-icon="x-alt"]');
                await page.click('span[data-icon="x-alt"]');*/

                if(timeout != undefined && timeout > 0)
                    await sleep(timeout);
            }
            catch (error) {
                console.error(`Error occurred while processing group ${groupName}: ${error}`);
                await sleep(60000);
            }
        }
    }

    console.log('Job is done.');
    process.exit(0);
}

// Check for the help option `-h` before proceeding
if (process.argv.includes('-h')) {
    console.log(`
        First, close all of your Google Chrome instances.

        Usage: node script.js <firstMemberName> <firstMemberNumber> <timeout>
        - firstMemberName: The name of the first member to add to the group.
        - firstMemberNumber: The phone number of the first member to add to the group.
        - timeout: Optional. Time in milliseconds to wait before processing the next group. Default is no wait.
        Example: node script.js "John Doe" "+90532000000" 5000
    `);
    process.exit(0);
}

const firstMemberName = process.argv[2];
const firstMemberNumber = process.argv[3];
const timeout = process.argv[4];

if(firstMemberName == undefined || firstMemberNumber == undefined){
    console.warn('You have to add a member to create a group, please input these values. See node groupCreator.js -h');
    return;
}

navigateToWhatsApp(firstMemberName, firstMemberNumber, timeout);