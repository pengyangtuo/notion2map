const { Client } = require('@notionhq/client');
require('dotenv').config();

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

module.exports = notion; 