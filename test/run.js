const childProcess = require("child_process");
const util = require("util");
const snap = require("snap-shot-it");

const exec = util.promisify(childProcess.exec);

it("Report", async () => {
  try {
    const { stdout, stderr } = await exec(
      "npx mocha --reporter ./reporter.js ./test/sample.js"
    );
    console.log("Test stdout:");
    console.log(stdout);
  } catch (e) {
    snap(e.stdout.replace(/\d+ms/, "100ms"));
    return;
  }

  throw Error("Should fail");
}).timeout(5 * 1000);
