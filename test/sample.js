const Reporter = require("../");
const snap = require("snap-shot-it");

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

context("Suite with before", () => {
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

context("Suite with before and nested context", () => {
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

context("Suite with before and nested context", () => {
  before(() => {
    console.log("Root before");
  });

  beforeEach(() => {
    console.log("Root before each");
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

    beforeEach(() => {
      console.log("Nested before each");
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

context("Hooks with no logs", () => {
  before(() => {});

  beforeEach(() => {});

  beforeEach(() => {
    console.log("before log");
  });

  it("Fails", () => {
    console.log("Fail");
    throw Error("Sample error");
  });
});

context("Snapshots", () => {
  it("Error", () => {
    if (process.env.SNAPSHOT_UPDATE === "1") {
      snap("Value A");
    } else {
      snap("Value B");
    }
  });
});

context("Suite with error in second beforeEach", () => {
  beforeEach(() => {
    console.log("beforeEach 1");
  });

  beforeEach(() => {
    console.log("beforeEach 2");
    throw Error("Before error");
  });

  it("Would fail", () => {
    console.log("Fail in test");
    throw Error("Sample error");
  });

  it("Would pass", () => {});
});

context("Suite with withSkipTestLogCaptureAsync", () => {
  beforeEach(async () => {
    await Reporter.withSkipTestLogCaptureAsync(async () => {
      console.log("spam");
      console.log("spam");
      console.log("spam");

      await new Promise((res) => setTimeout(res, 100));

      await Reporter.withSkipTestLogCaptureAsync(async () => {
        console.log("spam");
        console.log("spam");
        console.log("spam");
      }, "just nested spam");

      console.log("spam");
      console.log("spam");
      console.log("spam");
    }, "just spam");
  });

  it("Would fail", () => {
    console.log("Fail in test");
    throw Error("Sample error");
  });
});
