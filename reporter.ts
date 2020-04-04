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
  stringifyDiffObjs: (err: Mocha.Test["err"]) => string;
  showDiff: (err: Mocha.Test["err"]) => string;
  generateDiff: (actual: any, expected: any) => string;
};

const Base: BaseMod = require("mocha/lib/reporters/base");
const Spec: any = require("mocha/lib/reporters/spec");
const milliseconds = require("ms");
const color = Base.color;

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_BEGIN,
  EVENT_TEST_PENDING,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
} = Mocha.Runner.constants;

type CapturedLog =
  | { kind: "stdout"; text: string }
  | { kind: "stderr"; text: string };

type HookLogs = { hook: Mocha.Hook; logs: CapturedLog[] };

type TestCapture = {
  hooks: HookLogs[];
  testLogs: CapturedLog[];
};

// TODO: class
const stubLogs = () => {
  let mockDepth = 0;
  let isTestCapture = false;
  let beforeEach: HookLogs[] = [];

  const suiteHooksLogs: HookLogs[][] = [];

  const stdoutWrite = process.stdout.write;
  const stderrWrite = process.stderr.write;

  let calls: CapturedLog[] = [];

  const mockWrite = (kind: CapturedLog["kind"]) => (
    buffer: Uint8Array,
    encoding: unknown
  ) => {
    const text =
      typeof encoding === "string"
        ? buffer.toString() // TODO handle encoding
        : buffer.toString();

    calls.push({ kind, text });
    return true;
  };

  const restore = () => {
    mockDepth -= 1;

    if (!mockDepth) {
      process.stdout.write = stdoutWrite;
      process.stderr.write = stderrWrite;
    }

    calls = [];
  };

  const mock = () => {
    if (!mockDepth) {
      process.stdout.write = mockWrite("stdout");
      process.stderr.write = mockWrite("stderr");
    }

    mockDepth += 1;
  };

  return {
    popSuite: () => {
      suiteHooksLogs.pop();
    },
    pushSuite: () => {
      suiteHooksLogs.push([]);
    },
    captureHook: (hook: Mocha.Hook) => {
      if (!isTestCapture) {
        const suite = suiteHooksLogs.slice(-1)[0];

        suite.push({ hook, logs: [] });
      } else {
        beforeEach.push({ hook, logs: [] });
      }

      mock();
    },
    stopHookCapture: () => {
      if (!isTestCapture) {
        const suite = suiteHooksLogs.slice(-1)[0];
        const hook = suite.slice(-1)[0];

        hook.logs = calls;
      } else {
        const hook = beforeEach.slice(-1)[0];
        hook.logs = calls;
      }

      restore();
    },
    captureTest: () => {
      isTestCapture = true;

      mock();
    },
    stopTestCapture: (): TestCapture => {
      isTestCapture = false;

      const testLogs = calls;

      restore();

      const hooks = ([] as HookLogs[])
        .concat(...suiteHooksLogs)
        .concat(...beforeEach)
        .filter(({ logs }) => logs.length > 0);

      beforeEach = [];

      return {
        hooks,
        testLogs,
      };
    },
  };
};

class DDReporter extends Spec {
  epilogue() {
    epilogue(this, this.failuresLogs);
  }

  failuresLogs: TestCapture[];

  constructor(runner: Mocha.Runner) {
    const stub = stubLogs();

    runner
      .on(EVENT_SUITE_BEGIN, (suite) => {
        stub.pushSuite();
      })
      .on(EVENT_SUITE_END, () => {
        stub.popSuite();
      })
      .on(EVENT_HOOK_BEGIN, (hook) => {
        stub.captureHook(hook);
      })
      .on(EVENT_HOOK_END, () => {
        stub.stopHookCapture();
      })
      .on(EVENT_TEST_BEGIN, () => {
        stub.captureTest();
      })
      .on(EVENT_TEST_PASS, (test) => {
        stub.stopTestCapture();
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        this.failuresLogs.push(stub.stopTestCapture());
      });

    super(runner);

    this.failuresLogs = [];
  }
}

function showCapturedOutput(captured: TestCapture) {
  const indent = "     ";
  const infoColor = "error stack";

  const formatLog = (log: CapturedLog) =>
    indent +
    (log.kind === "stdout" ? log.text : color("error message", log.text));

  const hasHookLogs = captured.hooks.find((h) => h.logs.length);
  const hasTestLogs = !!captured.testLogs.length;

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
    captured.testLogs.forEach((l) => process.stdout.write(formatLog(l)));
  }

  if (hasHookLogs || hasTestLogs) {
    process.stdout.write(indent + color(infoColor, "End captured output\n"));
  } else {
    process.stdout.write(indent + color(infoColor, "No captured output\n"));
  }
}

type ExtendedError = Omit<Mocha.Test, "err"> & {
  err?: Mocha.Test["err"] & {
    multiple?: Array<NonNullable<Mocha.Test["err"]>>;
  };
};

// Mostly copied from mocha/lib/reporters/base.js

function list(failures: Array<ExtendedError>, capturedLogs: TestCapture[]) {
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
      Base.stringifyDiffObjs(err);
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

function epilogue(report: any, capturedLogs: TestCapture[]) {
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

export = DDReporter;
