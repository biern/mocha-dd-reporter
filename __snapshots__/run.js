exports['Report 1'] = `


  Testing logs
    ✓ Successfull test
    1) Failing test
    2) Failing test with no logs
    3) Failing test with error logged
    Nested context
      4) Fail in nested context

  Suite with beforeEach
    5) Fails 1
    6) Fails 2

  Suite with before
    7) Fails 1
    8) Fails 2

  Suite with before and nested context
    9) Fails 1
    10) Fails 2
    nested context
      11) Nested fails 1
      12) Nested fails 2

  Suite with before and nested context
    13) Fails 1
    14) Fails 2
    nested context
      15) Nested fails 1
      16) Nested fails 2

  Hooks with no logs
    17) Fails

  Snapshots
    18) Error

  Suite with error in second beforeEach
    19) "before each" hook for "Would fail"

  Suite with withSkipTestLogCaptureAsync
    20) Would fail


  1 passing (100ms)
  20 failing

  1) Testing logs
       Failing test:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:10:11)
      at processImmediate (internal/timers.js:456:21)

     Captured test output
     Should be visible
     End captured output
  2) Testing logs
       Failing test with no logs:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:14:11)
      at processImmediate (internal/timers.js:456:21)

     No captured output
  3) Testing logs
       Failing test with error logged:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:28:11)
      at processImmediate (internal/timers.js:456:21)

     Captured test output
     Log 1
     Some error
     Log 2
     End captured output
  4) Testing logs
       Nested context
         Fail in nested context:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:20:13)
      at processImmediate (internal/timers.js:456:21)

     Captured test output
     Should be visible
     End captured output
  5) Suite with beforeEach
       Fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:39:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before each" hook in "Suite with beforeEach")
     beforeEach test
     Captured test output
     Fail 1
     End captured output
  6) Suite with beforeEach
       Fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:44:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before each" hook in "Suite with beforeEach")
     beforeEach test
     Captured test output
     Fail 2
     End captured output
  7) Suite with before
       Fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:55:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before")
     before test
     Captured test output
     Fail 1
     End captured output
  8) Suite with before
       Fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:60:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before")
     before test
     Captured test output
     Fail 2
     End captured output
  9) Suite with before and nested context
       Fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:71:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured test output
     Fail 1
     End captured output
  10) Suite with before and nested context
       Fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:76:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured test output
     Fail 2
     End captured output
  11) Suite with before and nested context
       nested context
         Nested fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:86:13)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before all" hook in "nested context")
     Nested before
     Captured test output
     Nested fail 1
     End captured output
  12) Suite with before and nested context
       nested context
         Nested fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:91:13)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before all" hook in "nested context")
     Nested before
     Captured test output
     Nested fail 2
     End captured output
  13) Suite with before and nested context
       Fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:107:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before each" hook in "Suite with before and nested context")
     Root before each
     Captured test output
     Fail 1
     End captured output
  14) Suite with before and nested context
       Fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:112:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before each" hook in "Suite with before and nested context")
     Root before each
     Captured test output
     Fail 2
     End captured output
  15) Suite with before and nested context
       nested context
         Nested fails 1:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:126:13)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before all" hook in "nested context")
     Nested before
     Captured output of "before each" hook in "Suite with before and nested context")
     Root before each
     Captured output of "before each" hook in "nested context")
     Nested before each
     Captured test output
     Nested fail 1
     End captured output
  16) Suite with before and nested context
       nested context
         Nested fails 2:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:131:13)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured output of "before all" hook in "nested context")
     Nested before
     Captured output of "before each" hook in "Suite with before and nested context")
     Root before each
     Captured output of "before each" hook in "nested context")
     Nested before each
     Captured test output
     Nested fail 2
     End captured output
  17) Hooks with no logs
       Fails:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:147:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before each" hook in "Hooks with no logs")
     before log
     Captured test output
     Fail
     End captured output
  18) Snapshots
       Error:
     Error: Different value of snapshot "Snapshots Error"
"Value A" => "Value B"
      at /home/biern/projects/test/mocha-log/node_modules/snap-shot-core/src/file-system.js:263:11
      at InternalConstructor.orElse (node_modules/folktale/result/result.js:187:14)
      at raiseIfDifferent (node_modules/snap-shot-core/src/file-system.js:254:10)
      at setOrCheckValue (node_modules/snap-shot-core/src/index.js:367:7)
      at core (node_modules/snap-shot-core/src/index.js:388:12)
      at snapshot (node_modules/snap-shot-it/src/index.js:293:18)
      at Context.<anonymous> (test/sample.js:156:7)
      at processImmediate (internal/timers.js:456:21)

     No captured output
  19) Suite with error in second beforeEach
       "before each" hook for "Would fail":
     Error: Before error
      at Context.<anonymous> (test/sample.js:168:11)
      at processImmediate (internal/timers.js:456:21)

     Captured output of "before each" hook in "Suite with error in second beforeEach")
     beforeEach 1
     Captured test output
     beforeEach 2
     End captured output
  20) Suite with withSkipTestLogCaptureAsync
       Would fail:
     Error: Sample error
      at Context.<anonymous> (test/sample.js:203:11)

     Captured output of "before each" hook in "Suite with withSkipTestLogCaptureAsync")
     ...skipped 9 lines (just spam)...
     Captured test output
     Fail in test
     End captured output



`
