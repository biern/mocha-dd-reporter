context("Testing logs", () => {
  it("Successfull test", () => {
    console.log("Should not be visible");
  });

  it("Failing test", () => {
    console.log("Should be visible");
    throw Error("Sample error");
  });

  it("Failing test with no logs", () => {
    throw Error("Sample error");
  });

  context("Nested context", () => {
    it("Fail in nested context", () => {
      console.log("Should be visible");
      throw Error("Sample error");
    });
  });

  it("Failing test with error logged", () => {
    console.log("Log 1");
    console.error("Some error");
    console.log("Log 2");
    throw Error("Sample error");
  });
});
