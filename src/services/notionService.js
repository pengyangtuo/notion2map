const notion = require('../config/notion');
const { handleError } = require('../utils/errorHandler');

class NotionService {
  async getDatabaseContent(databaseId) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
      });
      
      return response.results;
    } catch (error) {
      handleError('Error fetching database content', error);
    }
  }
}

module.exports = new NotionService(); 