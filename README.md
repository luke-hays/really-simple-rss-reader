# Really Simple (Maybe) Rss Reader

This project contains both front and backend code for an RSS reader. The reason for placing all code into one repository is a matter of convenience for a portfolio project. I also enjoy being able to run docker compose from the root of this repo to set everything up.

This is meant to help excercise or explore some skills for a completely full stack application, and holds some of amount of personal interest for myself. Its mainly for fun and exploring.

It is not meant to be hosted so that its reachable from the internet. I don't want the responsibility of maintaining this thing for anyone thats not family on my own personal network.

## How do I run this?

Clone it down, have docker installed, run `docker compose` commands. 

The UI is accessible via `localhost:8080`. Feel free to edit the docker files and change things around as you see fit.

## Notes

### Current Functionality

- Main page contains an accordion that displays the current selected feed (defaults to first feed if available)
- Other feeds are selectable from a list, selecting one will fetch latest content - typically from cache, or from the source if a cache miss occurs
- RSS Feeds can be removed from the list
- Feed items show a link with a description of the content

### Outstanding

#### Frontend
- Spinner for pending delete state. The button is disabled, just need spinner.
- Need pending state when switching between fields
- Either disable selecting a new field or cancel the previous request when pending
- There appears to be a small visual bug when only feed is available in the list, and the user clicks on it

#### Backend
- Explore monitoring and better error handling
- Consider feasability of placing this onto homelab
- Set up the feed validator as a [self hosted instance](https://github.com/w3c/feedvalidator)

## Tech Stack

One goal of this project was to work with minimal dependencies. Otherwise, for now, its a pretty simple Client, Server, Database architecture.

### Frontend

This is set up with Vite for bundling. Otherwise the only dependency is TypeScript. The rest is native APIs. I've also explored some Web Component usage for the first time. The results are... mixed. But definitely an interesting concept.

### Backend

This has more dependencies. TypeScript still in use, Express added for ease of writing REST APIs, and MongoDB driver for handling connections to a database (Mongo). Redis is used for caching.

- TypeScript
- Express
- MongoDB Driver
- Redis
- jsdom (necessary for parsing xml)
- validator (validating URL string)

A seperate check occurs against W3C RSS Feed validator.

I am also using the REST Client extension on VsCode to test sending requests to the API.

### Database

Opted for MongoDB for a change of pace from SQL. Redis is a pretty simple cache so this does not constantly hit feeds with requests.
