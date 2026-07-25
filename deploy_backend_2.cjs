const fs = require('fs');
const path = require('path');

// 1. Deploy Route
const sourceRoute = path.join(__dirname, 'temp_contact_route.js');
const destRoute = path.join(__dirname, '../backend/routes/contact/contact.js');

try {
    const content = fs.readFileSync(sourceRoute, 'utf8');
    fs.writeFileSync(destRoute, content);
    console.log('Deployed route to', destRoute);
} catch (e) {
    console.error('Error deploying route:', e);
}

// 2. Update index.js
const indexPath = path.join(__dirname, '../backend/index.js');
try {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check if already added
    if (!indexContent.includes("require('./routes/contact/contact')")) {
        // Add import
        const importLine = "const contactRoutes = require('./routes/contact/contact'); // Importing contact routes";
        indexContent = indexContent.replace("const newsRoutes = require('./routes/news/news'); // Importing the news routes", 
            "const newsRoutes = require('./routes/news/news'); // Importing the news routes\n" + importLine);
        
        // Add usage
        const usageLine = "app.use('/api', contactRoutes);";
        indexContent = indexContent.replace("app.use('/api', newsRoutes);", 
            "app.use('/api', newsRoutes);\n" + usageLine);
        
        fs.writeFileSync(indexPath, indexContent);
        console.log('Updated backend/index.js');
    } else {
        console.log('backend/index.js already updated');
    }
} catch (e) {
    console.error('Error updating index.js:', e);
}
