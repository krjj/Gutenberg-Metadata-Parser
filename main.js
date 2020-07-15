require('dotenv').config()

const glob = require('glob')
const { parseRDF } = require('./libParser')
const { connect, saveRecordToDb } = require('./dbHelper')

var startTime
var endTime = 0

connect(process.env['MONGO-URL'])
  .then((mongoose) => {
    const { default: PQueue } = require('p-queue')
    const queue = new PQueue({
      concurrency: parseInt(process.env.CONCURRENCY)
    })

    queue.on('idle', () => {
      if (queue.size === 0 && queue.pending === 0) {
        console.log('All files processed. Now exiting.')
        endTime = Date.now()
        console.log('Finished in ', (endTime - startTime) / 1000, 'secs')
        process.exit()
      }

      console.log(
        ` Queue is idle.  Size: ${queue.size}  Pending: ${queue.pending}`
      )
    })

    queue.on('active', () => {
      console.log(` Queue Size: ${queue.size}  Pending: ${queue.pending}`)
    })

    startTime = Date.now()

    // read all files and parse from rdf-repository folder, then persist data to db
    glob('rdf-repository/**/*.rdf', {}, function (er, files) {
      // Enforce artificial limit
      // files = files.slice(0, 10000)

      if (er) {
        console.log(' Unable to read directory. Now exiting.')
        process.exit()
      }

      console.log(files.length + ' *.rdf files found')
      
      if(files.length===0){
          process.exit()
      }

      for (const f of files) {
        console.log('Adding ', f, 'to the queue')
        queue.add(() => parseRdfAndSaveToDb(f))
      }
    })
  })
  .catch((e) => {
    console.log(e)
    process.exit()
  })

// helpers
function parseRdfAndSaveToDb (path) {
  return new Promise((resolve, reject) => {
    parseRDF(path)
      .then((data) => {
        saveRecordToDb(data)
          .then((d) => {
            resolve()
          })
          .catch((e) => {
            reject(e)
          })
      })
      .catch((e) => {
        console.error(e)
        reject(e)
      })
  })
}
