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


Mocha + Chai is used as test framework.

Istanbuljs/nyc (https://github.com/istanbuljs/nyc) used for coverage testing






All the below applies to commit (https://github.com/krjj/kshitij-example-code/commit/5c2d671e6012184cf82d6f83cd98f8cc7d175716)


## Performance/Scalibility



Time to index all the content (Database persistence not included) : Around 4-5 minutes on Intel i3 2 core processor with 8 GB of memory (https://ark.intel.com/content/www/us/en/ark/products/122590/intel-core-i3-7020u-processor-3m-cache-2-30-ghz.html).


Memory consumption (chromedev tools)
`
Peak - 400-450 MB & Average - 100-200 MB
`

Memory/Network optimisation (not done)

With respect to network optimisation - no data is downloaded, the rdf files are expected to be retreived by the user manually in this commit.

Memory consumption can be decreased by queuing the parse rdf file requests. How many concurrent instances can run could be limited.


## Reliability/Unit test 

During the test run (all records) - the extraction worked correctly. Unit tests are `not` thorough. Preference was giving to setting up of the framework + coverage in this commit. Example test case is added that check the code against valid rdf file and expects successful execution.


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

In case if SQL database is used, normalization of data is required. Multiple tables i.e author, publisher, book will be created. JOINs can be used to query the data.




