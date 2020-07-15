const glob = require("glob");
const { parseRDF } = require("./libParser");



var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/guntenberg').then(console.log('Connected to DB')).catch((e) => {
    console.error("Unable to connect to mongodb")
    process.exit()
});


var metaSchema = mongoose.Schema({
    id: Number,
    title: String,
    author: [String],
    publisher: String,
    publicationDate: String,
    language: [String],
    subjects: [String],
    license: String,
});

var metaCollection = mongoose.model('meta', metaSchema);


function saveRecordToDb(data) {
    return new Promise((resolve, reject) => {
        metaCollection.create({
            id: data.id,
            title: data.title,
            author: data.author,
            publisher: data.publisher,
            publicationDate: data.publicationDate,
            language: data.language,
            subjects: data.subjects,
            license: data.license,
        }).then((doc) => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

// single file parsing 
 parseRDF("test/sample data/pg2701.rdf")
    .then((data) => {
        saveRecordToDb(data).then((d) => {
            console.log('saved')
        }).catch((e) => {
            console.log("not saved")
        })
    })
    .catch((e) => {
        console.log(e);
    });
 

// read all files and parse from rdf-repository folder
glob(`rdf-repository/rdf-files/**/*.rdf`, {}, function (er, files) {
    console.log(files.length + " *.rdf files found");

    if (!er) {
        for (let f of files) {
            parseRDF(f)
                .then((data) => {
                  // PERSIST TO DB HERE USING saveRecordToDb()
                  console.log(data.id)
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }
});
