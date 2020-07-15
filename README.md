# kshitij-example-code
Gutenberg Meta Parser


## Usage 

1. Clone the repo
2. Create the rdf-repository inside the project directory
3. Extract RDF files inside rdf-repository directory.

To run the script 
`node main.js`

Test 
`yarn run test`

Coverage Test 
`yarn run coverage`

Download the Gutenberg meta file tar.bz2
`yarn run downloadmeta`

Mocha + Chai is used as test framework.

Istanbuljs/nyc (https://github.com/istanbuljs/nyc) used for coverage testing






All the below applies to commit (https://github.com/krjj/kshitij-example-code/commit/8a5463c34a8ffe74807e0c5b1ca3c068c2be315d)


## Performance/Scalibility



Time to index all the content (including database persistence) : Around 10-16 minutes on Intel i3 2 core processor with 8 GB of memory (https://ark.intel.com/content/www/us/en/ark/products/122590/intel-core-i3-7020u-processor-3m-cache-2-30-ghz.html).


Memory consumption (chromedev tools)
`Peak - 400-450 MB (During scanning for rdf files in directory) & Average - 80-110 MB (if concurrency is set to 5)`

Memory/Network optimisation (using concurrency/queues)

With respect to network optimisation - no data is downloaded, the rdf files are expected to be retreived by the user manually in this commit.

Memory consumption is decreased by queuing the parse rdf file requests. How many concurrent instances can run could be limited. Default is 5.


## Reliability/Unit test 

During the test run (all records) - the extraction worked correctly. 3 Unit tests for libParser.js/parseRDF() available. 100% code coverage (libParser.js) using istanbul/nyc.


## Querying the database

Extracted data is stored in MongoDB.

Schema of the collection 
`var metaSchema = mongoose.Schema({
    id: Number,
    title: String,
    author: [String],
    publisher: String,
    publicationDate: String,
    language: [String],
    subjects: [String],
    license: String,
});`

Variation of this mongo query can be used to get the result based on title, author, publicationDate 
`db.getCollection('metas').find({ $or: [
                            {title: /^Moby Dick/i},
                            {author : /^Melville, Herman/i},
                            {publicationDate : /^2001-01-01/}
                        ], })
`

In case if SQL database is used, normalization of data is required. Multiple tables i.e author, publisher, book will be created. JOINs can be used to query the data.




