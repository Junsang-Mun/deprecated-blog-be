import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { postPreview } from './cleanup.js';
dotenv.config();

export async function lookupDB() {
	const url = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;
	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			'Notion-Version': '2022-06-28',
			authorization: `Bearer ${process.env.NOTION_TOKEN}`
		},
		body: JSON.stringify({
			page_size: 100,
			filter: {
				"property": "published",
				"select": {
					"equals": "YES"
				}
			}
		})
	};

	const response = await fetch(url, options);
	if (response.status === 200) {
		const json = await response.json();
		const data = postPreview(json.results);
		return data;
	} else {
		console.error(`Notion API Error: Status code ${response.status} @ lookupDB`);
	}
}

export async function queryPageByTag(tag) {
	const url = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;
	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			'Notion-Version': '2022-06-28',
			authorization: `Bearer ${process.env.NOTION_TOKEN}`
		},
		body: JSON.stringify({
			page_size: 100,
			filter: {
				"property": "tags",
				"multi_select": {
					"contains": tag
				}
			}
		})
	};

	const response = await fetch(url, options);
	if (response.status === 200) {
		const data = await response.json();
		return data;
	} else {
		console.error(`Notion API Error: Status code ${response.status} @ queryPageByTag`);
	}
}

export async function queryPage(id) {
	const url = `https://api.notion.com/v1/blocks/${id}/children?page_size=100`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'Notion-Version': '2022-06-28',
			authorization: `Bearer ${process.env.NOTION_TOKEN}`
		}
	};

	const response = await fetch(url, options);
	if (response.status === 200) {
		const data = await response.json();
		return data;
	} else {
		console.error(`Notion API Error: Status code ${response.status} @ queryPage`);
	}
}