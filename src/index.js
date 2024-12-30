const notionService = require('./services/notionService');
require('dotenv').config();

async function main() {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is required');
    }

    const databaseContent = await notionService.getDatabaseContent(databaseId);
    console.log('Database content:', databaseContent);
  } catch (error) {
    console.error('Application error:', error);
  }
}

main(); 