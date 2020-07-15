const { parseRDF } = require("../libParser");
var expect = require("chai").expect;

describe("#libParser - parseRDF()", function () {
    context("Sample Data 1", function () {
        it("should complete successfully on valid RDF format", function (done) {
            parseRDF("test/sample data/pg2701.rdf")
                .then((data) => {
                    expect(data.id).to.be.equal(2701);
                    expect(data.title).to.be.equal("Moby Dick; Or, The Whale");
                    expect(data.author).to.be.a("array").length.greaterThan(0);
                    expect(data.publisher).to.be.a("string").not.empty;
                    expect(data.publicationDate).to.be.a("string").not.empty;
                    expect(data.language).to.be.a("array").length.greaterThan(0);
                    expect(data.subjects).to.be.a("array").length.greaterThan(0);
                    expect(data.license).to.be.a("string").not.empty;

                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    context("Sample Data 2", function () {
        it("should fail due to incompatible RDF format", function (done) {
            parseRDF("test/sample data/pg2702.rdf")
                .then((data) => {
                    done(new Error('Expected method to reject.'));
                })
                .catch((e) => {
                    done();
                });
        });
    });

    context("Invalid Path", function () {
        it("should fail due to invalid file path", function (done) {
            parseRDF("test/sample data/invalid_path_328498.rdf")
                .then((data) => {
                    done(new Error('Expected method to reject.'));
                })
                .catch((e) => {
                    expect(e).contains('Error while reading file')
                    done();
                });
        });
    });


});
