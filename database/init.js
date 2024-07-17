// https://www.mongodb.com/docs/manual/reference/method/db.getSiblingDB/
// We can't rune the `use <database>` command, so this is necessary
db = db.getSiblingDB('rss');

// Create for our list of rss feeds
db.createCollection('feeds');

// We'll tag the "source" as a unique index to prevent duplicate feeds
db.feeds.createIndex({source: 1}, {unique: true})

// If we wanted to add search functionality, we could introduce a Text Index here later