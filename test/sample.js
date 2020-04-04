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

context("Suite with beforeEach", () => {
  beforeEach(() => {
    console.log("beforeEach test");
  });

  it("Fails 1", () => {
    console.log("Fail 1");
    throw Error("Sample error");
  });

  it("Fails 2", () => {
    console.log("Fail 2");
    throw Error("Sample error");
  });
});

context.only("Suite with before", () => {
  before(() => {
    console.log("before test");
  });

  it("Fails 1", () => {
    console.log("Fail 1");
    throw Error("Sample error");
  });

  it("Fails 2", () => {
    console.log("Fail 2");
    throw Error("Sample error");
  });
});

context.only("Suite with before and nested context", () => {
  before(() => {
    console.log("Root before");
  });

  it("Fails 1", () => {
    console.log("Fail 1");
    throw Error("Sample error");
  });

  it("Fails 2", () => {
    console.log("Fail 2");
    throw Error("Sample error");
  });

  context("nested context", () => {
    before(() => {
      console.log("Nested before");
    });

    it("Nested fails 1", () => {
      console.log("Nested fail 1");
      throw Error("Sample error");
    });

    it("Nested fails 2", () => {
      console.log("Nested fail 2");
      throw Error("Sample error");
    });
  });
});
