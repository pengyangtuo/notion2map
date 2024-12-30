// API route to fetch locations from Notion
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

export default async function handler(req, res) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID
  })
  
  // Assuming you have address or coordinates in your database
  const locations = response.results.map(page => (
    {
    name: page.properties.Name.title[0]?.plain_text,
    place: page.properties.Place.rich_text[0]?.plain_text,
    // or if you have coordinates:
    // lat: page.properties.Latitude.number,
    // lng: page.properties.Longitude.number
  }))

  res.status(200).json(locations)
} 