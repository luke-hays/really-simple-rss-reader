// const fetchDb = async () => {
//   return new Promise<IDBDatabase>((resolve, reject) => {
//     let db : IDBDatabase | null = null;

//     const request = indexedDB.open('rss-feeds', 1)
    
//     request.onupgradeneeded = (e) => {
//       console.log('running initialization')
//       db = (e.target as IDBOpenDBRequest)?.result
    
//       const rssFeedStore = db?.createObjectStore('rssFeeds', {keyPath: 'source'})
    
//       rssFeedStore?.createIndex('title', 'title', {unique: false})
//       rssFeedStore?.createIndex('description', 'description', {unique: false})
//     }
    
//     request.onerror = e => {
//       console.error('error with indexdb', (e.target as IDBOpenDBRequest)?.error)
//       reject('error opening db')
//     }
    
//     request.onsuccess = (e) => {
//       db = (e.target as IDBOpenDBRequest)?.result
//       resolve(db)
//     }
//   })
// }

// export const getAllRssFeeds = async () => {
//   const db = await fetchDb()

//   return new Promise<Array<{title: string, source: string}>>((resolve, reject) => {
//     let transaction = db?.transaction(['rssFeeds'], "readonly")
//     let rssFeedsObjectStore = transaction?.objectStore('rssFeeds')
  
//     console.log(rssFeedsObjectStore?.index)
  
//     const rssFeedsRequest = rssFeedsObjectStore?.index('title').getAll()
  
//     if (rssFeedsRequest == null) reject('unable to get Rss Feeds')
  
//     rssFeedsRequest.onsuccess = e => {
//       const target = e.target as IDBRequest
//       const results = target.result as Array<{title: string}>
      
      
//       console.log(results)
//       resolve(results)
//     }

//     rssFeedsRequest.onerror = e => {
//       reject('unable to fetch rss')
//     }
//   })
// }

// // This is the main RssFeed, items can be associated seperately
// // Should handle parsing outside of this function
// export const postRssFeed = (document : Document) => {
//   // let transaction = db?.transaction(['rssFeeds'], "readwrite")
//   // let rssFeeds = transaction?.objectStore('rssFeeds')

//   // if (document == null) {
//   //   throw new Error('Unable to parse RSS Feed due to nonexistant document')
//   // }

//   // const source = document.querySelector('link')
//   // const title = document.querySelector('title')
//   // const description = document.querySelector('description')

//   // if (!source?.textContent || !title?.textContent || !description?.textContent) {
//   //   throw new Error('Unable to parse RSS Feed due to missing information')
//   // }

//   // let newFeed = {
//   //   source: source.textContent.trim(),
//   //   title: title.textContent.trim(),
//   //   description: title.textContent.trim()
//   // }

//   // try {
//   //   rssFeeds?.add(newFeed)
//   //   console.log('add feed')
//   // } catch (error) {
//   //   throw new Error('Unable to add RSS Feed to DB')
//   // }
// }