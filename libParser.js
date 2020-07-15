const fs = require("fs");
const parseString = require("xml2js").parseString;

function parseRDF(xmlPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(xmlPath, "utf8", (err, xml) => {
      if (err) {
        reject("Error while reading file : " + xmlPath + " " + err);
      }

      try {
        parseString(xml, function (err, result) {
          if (err) {
            throw "parsing of xml string failed";
          }

          const output = {
            id: 0,
            title: "",
            author: [],
            publisher: "",
            publicationDate: "",
            language: [],
            subjects: [],
            license: "",
          };

          // ID
          if (result["rdf:RDF"]["pgterms:ebook"][0].$["rdf:about"]) {
            output.id = parseInt(
              result["rdf:RDF"]["pgterms:ebook"][0].$["rdf:about"]
                .toString()
                .split("/")[1]
            );
          }

          // Title
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:title"]) {
            output.title = result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:title"
            ].join("");
          }

          // Author ITERATE
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:creator"]) {
            const authors = [];
            for (const agent of result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:creator"
            ]) {
              if (agent["pgterms:agent"]) {
                authors.push(
                  agent["pgterms:agent"][0]["pgterms:name"].join("")
                );
              }
            }
            output.author = authors;
          }

          // Publisher
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:publisher"]) {
            output.publisher = result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:publisher"
            ].join("");
          }

          // Publication Date
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:issued"][0]) {
            output.publicationDate =
              result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:issued"][0][
                Object.keys(
                  result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:issued"][0]
                )[0]
              ];
          }

          // Language ITERATE
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:language"]) {
            const language = [];
            for (const lang of result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:language"
            ]) {
              language.push(
                lang["rdf:Description"][0]["rdf:value"][0][
                  Object.keys(lang["rdf:Description"][0]["rdf:value"][0])[0]
                ]
              );
            }
            output.language = language;
          }

          // Subjects ITERATE
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:subject"]) {
            const subjects = [];

            for (const subject of result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:subject"
            ]) {
              subjects.push(subject["rdf:Description"][0]["rdf:value"][0]);
            }

            output.subjects = subjects;
          }

          // License Rights
          if (result["rdf:RDF"]["pgterms:ebook"][0]["dcterms:rights"]) {
            output.license = result["rdf:RDF"]["pgterms:ebook"][0][
              "dcterms:rights"
            ].join("");
          }

          resolve(output);
        });
      } catch (e) {
        reject("Error while parsing xml : " + xmlPath + " : " + e);
      }
    });
  });
}

// usage
/*
parseRDF('rdf-repository/rdf-files/cache/epub/24017/pg24017.rdf').then((data) => {
    console.log(data)
}).catch((e) => {
    console.log(e)
})
 */

module.exports = {
  parseRDF: parseRDF,
};
