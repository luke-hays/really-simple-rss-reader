# Really Simple (Maybe) Rss Reader

Project containing both front and backend code for a web application that can render a list of RSS Feeds and their recent items.

The structure of this repo is not how I would normally set up two code repos for a UI and API. This is mosty to keep conde centralized in one place for ease of reference later.

This is very barebones, and not intended to be deployed in a reachable manner besides the developer on a local machine. Its just a project and motivation to dive deeper into some technical topics.

## Notes

Topics to help me remember some stuff I need to dive into later.

### Current Functionality

- User goes onto page
- List of RSS Feeds is fetched from API
- That list will be used to fetch latest content
- There is a single input field to add a URL to add to the main collection

### TODO

- Functionality for retrieving the list of RSS Feeds and their Content
- Functionality for adding a URL
- Backend validation on adding a URL
- Make a web component out of the Accordion in the Frontend
- Use Orchestration to run this all at once

### Stretch Goals
- Might make a version where that input validation is missing or lacking and then see if I run exploits on my own project
- Get this project set up so that I can easily provision and deploy to a Homelab running Proxmox as a hypervisor. UI, API, and DB will all have their own VMs
- Add User authentication and personal lists of feeds

## Tech Stack

One goal of this project was to work with minimal dependencies. Otherwise, for now, its a pretty simple Client, Server, Database architecture.

### Frontend

This is set up with Vite for bundling. Otherwise the only dependency is TypeScript. The rest is native APIs.

### Backend

Couple more dependencies with this. TypeScript still in use, Express for ease of writing REST APIs, and the MongoDB driver for handling connections to a database (surprise its Mongo).

- TypeScript
- Express
- MongoDB Driver
- jsdom (necessary for parsing xml)

I am also using the REST Client extension on VsCode to test sending requests to the API.

### Database

Opted for MongoDB for a change of pace from SQL.
