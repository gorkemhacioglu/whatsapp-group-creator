# WhatsApp Group Creator

This Node.js script utilizes Playwright to automate group creation and management tasks on WhatsApp Web.  
It reads group names from a text file, navigates through WhatsApp Web to create groups, adds a specified member as the group admin, and retrieves group invitation links. 

![image](https://github.com/gorkemhacioglu/whatsapp-group-creator/assets/32572262/f4b82cd7-7fcc-430e-b264-5511c12096a4)  

![image](https://github.com/gorkemhacioglu/whatsapp-group-creator/assets/32572262/719160d5-9499-4afe-83ea-2d2bc6dfe510)


## Prerequisites

- Node.js installed on your system.
- Playwright installed in your project.
- Google Chrome installed (the script uses Chrome's user data for automation).

## Setup

### Clone the Repository
Clone or download this repository to your local machine.

### Install Dependencies
Navigate to the project directory and install required npm packages:

```bash
npm install
```

### Prepare Group Names File
Make sure groupNames.txt file in the project root directory and list the names of the groups you wish to create, one group name per line.

### Usage
Run the script with the following command:

```bash
node script.js <firstMemberName> <firstMemberNumber> [timeout]
```

`<firstMemberName>`: *The name of the first member to add to the group (as it appears in WhatsApp).*  
`firstMemberNumber`: *The phone number of the first member to add to the group.*  
`[timeout]`: **Optional.** *Time in milliseconds to wait before processing the next group. Default is no wait.*  

### Example
```bash
node creator.js "John Doe" "+1234567890"
```

### Features
* Reads group names from groupNames.txt.  
* Automates group creation on WhatsApp Web.  
* Adds specified members as group admins.  
* Retrieves and saves group invitation links.  

### Important Notes
* **Creating 50 groups in a short period can lead to your account being blocked for 48 hours.**  
**Please proceed with care. Pause for a few hours before resuming your activities.**  
**Misuse of WhatsApp's services is strongly discouraged.**  
* Ensure no instances of Chrome are running before execution.  
* This script interacts with WhatsApp Web and requires stable internet connectivity.  
