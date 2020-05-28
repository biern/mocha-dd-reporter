const { color } = require("mocha/lib/reporters/base");

const warn = (text) => console.log(color("bright yellow", "Warning:"), text);
const info = (text) => console.log(color("green", "Info:"), text);
const debug = (text) => console.log(color("pending", "Debug:"), text);

context("User places an order", () => {
  beforeEach(() => {
    debug("Initializing DB");
    debug("Adding plenty of cheese to storage");
    debug("Adding fresh tomatoes to storage");
  });

  it("can order a white pizza", () => {
    info("Should be skipped");
  });

  it("can order a margherita", () => {
    info("Should be skipped");
  });

  it("can order a tuna pizza", () => {
    info("New order, checking pizza availability");
    warn("We're out of tuna, skipping order");
    throw Error("Cannot place order: cart is empty");
  });

  it("can order a four-cheese pizza", () => {
    info("Should be skipped");
  });
});
