
const Path = require('path')
const Axios = require('axios')
const ProgressBar = require('progress')

const fs = require('fs')
const bz2 = require('unbzip2-stream')
const tarfs = require('tar-fs')

function download() {
    return new Promise(async (resolve, reject) => {
        const url = 'http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.bz2'

        console.log('Connecting …')
        const { data, headers } = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        const totalLength = headers['content-length']

        console.log('Starting download')
        const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
            width: 40,
            complete: '=',
            incomplete: ' ',
            renderThrottle: 1,
            total: parseInt(totalLength)
        })

        const writer = fs.createWriteStream(
            Path.resolve(__dirname, 'rdf-files.tar.bz2')
        )

        data.on('data', (chunk) => progressBar.tick(chunk.length))
        data.on('close', () => { resolve() })
        data.pipe(writer)
    })
}

function extract() {
    if (fs.existsSync('rdf-repository')) {
        console.log('rdf-repository already exists. Delete dir if you want to perform this operation again.')
        process.exit()
    }

    console.log('Extracting to rdf-repository. This might take a few minutes...')
    fs.createReadStream('rdf-files.tar.bz2').pipe(bz2()).pipe(tarfs.extract('rdf-repository'))

}

download().then(() => {
    extract()
}).catch(() => { console.log('error') })

