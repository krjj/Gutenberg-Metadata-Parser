const { parseRDF } = require("../libParser");
var expect = require("chai").expect;

describe("#libParser - parseRDF()", function () {
  context("Sample Data 1", function () {
    it("should complete successfully", function (done) {
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
});
