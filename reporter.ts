// https://github.com/mochajs/mocha/issues/1998

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

// snapshot test by running a process and showing output diff

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_BEGIN,
  EVENT_TEST_PENDING,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
} = Mocha.Runner.constants;

type CapturedLog =
  | { kind: "stdout"; text: string }
  | { kind: "stderr"; text: string };

const stubLogs = () => {
  const calls: CapturedLog[] = [];

  const stdoutWrite = process.stdout.write;
  const stderrWrite = process.stderr.write;

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
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
    return calls;
  };

  process.stdout.write = mockWrite("stdout");
  process.stderr.write = mockWrite("stderr");

  return {
    calls,
    restore,
  };
};

class MyReporter extends Spec {
  epilogue() {
    epilogue(this, this.failuresLogs);
  }

  failuresLogs: CapturedLog[][];

  constructor(runner: Mocha.Runner) {
    let stub: ReturnType<typeof stubLogs>;

    runner
      .on(EVENT_TEST_BEGIN, () => {
        stub = stubLogs();
      })
      .on(EVENT_TEST_PASS, (test) => {
        stub.restore();
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        this.failuresLogs.push(stub.restore());
      });

    super(runner);

    this.failuresLogs = [];
  }
}

type ExtendedError = Omit<Mocha.Test, "err"> & {
  err?: Mocha.Test["err"] & {
    multiple?: Array<NonNullable<Mocha.Test["err"]>>;
  };
};

// Mostly copied from mocha/lib/reporters/base.js

function list(failures: Array<ExtendedError>, capturedLogs: CapturedLog[][]) {
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

function showCapturedOutput(captured: CapturedLog[]) {
  const indent = "     ";

  const formatLog = (log: CapturedLog) =>
    indent +
    (log.kind === "stdout" ? log.text : color("error message", log.text));

  if (captured.length) {
    Base.consoleLog(
      [
        indent + color("error stack", "Captured test output:\n"),
        captured.map(formatLog).join(""),
        indent + color("error stack", "End test output\n"),
      ].join("")
    );
  }
}

function epilogue(report: any, capturedLogs: CapturedLog[][]) {
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

export = MyReporter;
