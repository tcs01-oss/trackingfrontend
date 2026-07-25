const fs = require('fs');
const path = require('path');

const sourceController = path.join(__dirname, 'temp_contact_controller.js');
const destController = path.join(__dirname, '../backend/controllers/contact/contact.js');

try {
    const content = fs.readFileSync(sourceController, 'utf8');
    fs.writeFileSync(destController, content);
    console.log('Deployed controller to', destController);
} catch (e) {
    console.error('Error deploying controller:', e);
}
