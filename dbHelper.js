var mongoose = require("mongoose");

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

var metaCollection = mongoose.model("meta", metaSchema);

function connect(url) {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to the DB [MongoDB]");
        resolve(mongoose);
      })
      .catch((e) => {
        console.error("Unable to connect to mongodb");
        reject(e);
      });
  });
}

function saveRecordToDb(data) {
  return new Promise((resolve, reject) => {
    metaCollection
      .create({
        id: data.id,
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        publicationDate: data.publicationDate,
        language: data.language,
        subjects: data.subjects,
        license: data.license,
      })
      .then((doc) => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  saveRecordToDb: saveRecordToDb,
  connect: connect,
};
