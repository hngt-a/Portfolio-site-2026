const { Client } = require('@notionhq/client');
const { NotionAPI } = require('notion-client');

console.log('--- Debugging Notion Clients ---');

try {
    const official = new Client({ auth: 'secret_test' });
    console.log('Official Client Keys:', Object.keys(official));
    console.log('Official Client.databases:', official.databases);
    if (official.databases) {
        console.log('Official Client.databases.query type:', typeof official.databases.query);
    } else {
        console.error('CRITICAL: official.databases is undefined!');
    }
} catch (e) {
    console.error('Error initializing Official Client:', e);
}

try {
    const unofficial = new NotionAPI();
    console.log('Unofficial Client Keys:', Object.keys(unofficial));
} catch (e) {
    console.error('Error initializing Unofficial Client:', e);
}

console.log('--------------------------------');
