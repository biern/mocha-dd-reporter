import Mocha from "mocha";

type BaseMod = {
  consoleLog: typeof console.log;
  color: (type: string | undefined, str: string) => string;
  symbols: {
    ok: string;
    err: string;
    dot: string;
    comma: string;
    bang: string;
  };
  epilogue: () => void;
  showDiff: (err: Mocha.Test["err"]) => string;
  generateDiff: (actual: any, expected: any) => string;
};

const Base: BaseMod = require("mocha/lib/reporters/base");
const Spec: any = require("mocha/lib/reporters/spec");
const utils: any = require("mocha/lib/utils");

const milliseconds = require("ms");
const color = Base.color;

const {
  EVENT_TEST_BEGIN,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
} = Mocha.Runner.constants;

class DDReporter extends Spec {
  failuresLogs: TestCaptureLogs[];

  constructor(runner: Mocha.Runner) {
    const testCapture = new TestCapture();

    runner
      .on(EVENT_SUITE_BEGIN, testCapture.pushSuite)
      .on(EVENT_SUITE_END, testCapture.popSuite)
      .on(EVENT_HOOK_BEGIN, testCapture.captureHook)
      .on(EVENT_HOOK_END, testCapture.stopHookCapture)
      .on(EVENT_TEST_BEGIN, testCapture.captureTest)
      .on(EVENT_TEST_PASS, testCapture.stopTestCapture)
      .on(EVENT_TEST_FAIL, () => {
        this.failuresLogs.push(testCapture.stopTestCapture());
      });

    super(runner);

    this.failuresLogs = [];
  }

  epilogue() {
    epilogue(this, this.failuresLogs);
  }
}
type CapturedLog =
  | { kind: "stdout"; text: string }
  | { kind: "stderr"; text: string };

type HookLogs = { hook: Mocha.Hook; logs: CapturedLog[] };

type TestCaptureLogs = {
  hooks: HookLogs[];
  test: CapturedLog[];
};

class TestCapture {
  mockDepth = 0;
  isTestCapture = false;
  beforeEach: HookLogs[] = [];
  suiteHooksLogs: HookLogs[][] = [];
  captured: CapturedLog[] = [];

  stdoutWrite?: NodeJS.WriteStream["write"];
  stderrWrite?: NodeJS.WriteStream["write"];

  popSuite = () => {
    this.suiteHooksLogs.pop();
  };

  pushSuite = () => {
    this.suiteHooksLogs.push([]);
  };

  captureHook = (hook: Mocha.Hook) => {
    if (!this.isTestCapture) {
      const suite = this.suiteHooksLogs.slice(-1)[0];

      suite.push({ hook, logs: [] });
    } else {
      this.beforeEach.push({ hook, logs: [] });
    }

    this.mock();
  };

  stopHookCapture = () => {
    if (!this.isTestCapture) {
      const suite = this.suiteHooksLogs.slice(-1)[0];
      const hook = suite.slice(-1)[0];

      hook.logs = this.captured;
    } else {
      const hook = this.beforeEach.slice(-1)[0];
      hook.logs = this.captured;
    }

    this.restore();
  };

  captureTest = () => {
    this.isTestCapture = true;

    this.mock();
  };

  stopTestCapture = (): TestCaptureLogs => {
    this.isTestCapture = false;

    const testLogs = this.captured.filter((l) => !isLogIgnored(l));

    this.restore(true);

    const hooks = ([] as HookLogs[])
      .concat(...this.suiteHooksLogs)
      .concat(...this.beforeEach)
      .filter(({ logs }) => logs.length > 0);

    this.beforeEach = [];

    return {
      hooks,
      test: testLogs,
    };
  };

  protected restore = (force = false) => {
    this.mockDepth -= 1;

    if (!this.mockDepth || force) {
      this.mockDepth = 0;
      process.stdout.write = this.stdoutWrite!;
      process.stderr.write = this.stderrWrite!;
    }

    this.captured = [];
  };

  protected mock = () => {
    if (!this.mockDepth) {
      this.stdoutWrite = process.stdout.write;
      this.stderrWrite = process.stderr.write;
      process.stdout.write = this.mockWrite("stdout");
      process.stderr.write = this.mockWrite("stderr");
    }

    this.mockDepth += 1;
  };

  protected mockWrite = (kind: CapturedLog["kind"]) => (
    buffer: Uint8Array,
    encoding: unknown
  ) => {
    const text = buffer.toString(); // TODO handle encoding
    this.captured.push({ kind, text });
    return true;
  };
}

function showCapturedOutput(captured: TestCaptureLogs) {
  const indent = "     ";
  const infoColor = "error stack";

  const formatLog = (log: CapturedLog) =>
    indent +
    (log.kind === "stdout" ? log.text : color("error message", log.text));

  const hasHookLogs = captured.hooks.find((h) => h.logs.length);
  const hasTestLogs = !!captured.test.length;

  if (hasHookLogs) {
    captured.hooks.forEach(({ hook, logs }) => {
      process.stdout.write(
        indent +
          color(
            infoColor,
            `Captured output of ${hook.title} in "${
              hook.parent?.title || "root"
            }")\n`
          )
      );
      logs.forEach((l) => process.stdout.write(formatLog(l)));
    });
  }

  if (hasTestLogs) {
    process.stdout.write(indent + color(infoColor, "Captured test output\n"));
    captured.test.forEach((l) => process.stdout.write(formatLog(l)));
  }

  if (hasHookLogs || hasTestLogs) {
    process.stdout.write(indent + color(infoColor, "End captured output\n"));
  } else {
    process.stdout.write(indent + color(infoColor, "No captured output\n"));
  }
}

const isLogIgnored = (log: CapturedLog) =>
  log.text.startsWith("Different value of snapshot");

type ExtendedError = Omit<Mocha.Test, "err"> & {
  err?: Mocha.Test["err"] & {
    multiple?: Array<NonNullable<Mocha.Test["err"]>>;
  };
};

// Mostly copied from mocha/lib/reporters/base.js

function list(failures: Array<ExtendedError>, capturedLogs: TestCaptureLogs[]) {
  var multipleErr: any, multipleTest: any;
  Base.consoleLog();
  failures.forEach(function (test, i) {
    // format
    var fmt =
      color("error title", "  %s) %s:\n") +
      color("error message", "     %s") +
      color("error stack", "\n%s\n");

    // msg
    var msg;
    var err;
    if (test.err && test.err.multiple) {
      if (multipleTest !== test) {
        multipleTest = test;
        multipleErr = [test.err].concat(test.err.multiple);
      }
      err = multipleErr.shift();
    } else {
      err = test.err;
    }
    var message;
    if (err.message && typeof err.message.toString === "function") {
      message = err.message + "";
    } else if (typeof err.inspect === "function") {
      message = err.inspect() + "";
    } else {
      message = "";
    }
    var stack = err.stack || message;
    var index = message ? stack.indexOf(message) : -1;

    if (index === -1) {
      msg = message;
    } else {
      index += message.length;
      msg = stack.slice(0, index);
      // remove msg from stack
      stack = stack.slice(index + 1);
    }

    // uncaught
    if (err.uncaught) {
      msg = "Uncaught " + msg;
    }
    // explicitly show diff
    if (!exports.hideDiff && Base.showDiff(err)) {
      stringifyDiffObjs(err);
      fmt =
        color("error title", "  %s) %s:\n%s") + color("error stack", "\n%s\n");
      var match = message.match(/^([^:]+): expected/);
      msg = "\n      " + color("error message", match ? match[1] : msg);

      msg += Base.generateDiff(err.actual, err.expected);
    }

    // indent stack trace
    stack = stack.replace(/^/gm, "  ");

    // indented test title
    var testTitle = "";
    test.titlePath().forEach(function (str, index) {
      if (index !== 0) {
        testTitle += "\n     ";
      }
      for (var i = 0; i < index; i++) {
        testTitle += "  ";
      }
      testTitle += str;
    });

    Base.consoleLog(fmt, i + 1, testTitle, msg, stack);

    showCapturedOutput(capturedLogs[i]);
  });
}

function epilogue(report: any, capturedLogs: TestCaptureLogs[]) {
  var stats = report.stats;
  var fmt;

  Base.consoleLog();

  // passes
  fmt =
    color("bright pass", " ") +
    color("green", " %d passing") +
    color("light", " (%s)");

  Base.consoleLog(fmt, stats.passes || 0, milliseconds(stats.duration));

  // pending
  if (stats.pending) {
    fmt = color("pending", " ") + color("pending", " %d pending");

    Base.consoleLog(fmt, stats.pending);
  }

  // failures
  if (stats.failures) {
    fmt = color("fail", "  %d failing");

    Base.consoleLog(fmt, stats.failures);

    list(report.failures, capturedLogs);
    Base.consoleLog();
  }

  Base.consoleLog();
}

function stringifyDiffObjs(err: any) {
  if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
    err.actual = utils.stringify(err.actual);
    err.expected = utils.stringify(err.expected);
  }
}

export = DDReporter;
