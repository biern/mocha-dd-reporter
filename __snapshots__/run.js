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


  1 passing (100ms)
  17 failing

  1) Testing logs
       Failing test:
     Error: Sample error
      at Context.it (test/sample.js:8:11)

     Captured test output
     Should be visible
     End captured output
  2) Testing logs
       Failing test with no logs:
     Error: Sample error
      at Context.it (test/sample.js:12:11)

     No captured output
  3) Testing logs
       Failing test with error logged:
     Error: Sample error
      at Context.it (test/sample.js:26:11)

     Captured test output
     Log 1
     Some error
     Log 2
     End captured output
  4) Testing logs
       Nested context
         Fail in nested context:
     Error: Sample error
      at Context.it (test/sample.js:18:13)

     Captured test output
     Should be visible
     End captured output
  5) Suite with beforeEach
       Fails 1:
     Error: Sample error
      at Context.it (test/sample.js:37:11)

     Captured output of "before each" hook in "Suite with beforeEach")
     beforeEach test
     Captured test output
     Fail 1
     End captured output
  6) Suite with beforeEach
       Fails 2:
     Error: Sample error
      at Context.it (test/sample.js:42:11)

     Captured output of "before each" hook in "Suite with beforeEach")
     beforeEach test
     Captured test output
     Fail 2
     End captured output
  7) Suite with before
       Fails 1:
     Error: Sample error
      at Context.it (test/sample.js:53:11)

     Captured output of "before all" hook in "Suite with before")
     before test
     Captured test output
     Fail 1
     End captured output
  8) Suite with before
       Fails 2:
     Error: Sample error
      at Context.it (test/sample.js:58:11)

     Captured output of "before all" hook in "Suite with before")
     before test
     Captured test output
     Fail 2
     End captured output
  9) Suite with before and nested context
       Fails 1:
     Error: Sample error
      at Context.it (test/sample.js:69:11)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured test output
     Fail 1
     End captured output
  10) Suite with before and nested context
       Fails 2:
     Error: Sample error
      at Context.it (test/sample.js:74:11)

     Captured output of "before all" hook in "Suite with before and nested context")
     Root before
     Captured test output
     Fail 2
     End captured output
  11) Suite with before and nested context
       nested context
         Nested fails 1:
     Error: Sample error
      at Context.it (test/sample.js:84:13)

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
      at Context.it (test/sample.js:89:13)

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
      at Context.it (test/sample.js:105:11)

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
      at Context.it (test/sample.js:110:11)

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
      at Context.it (test/sample.js:124:13)

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
      at Context.it (test/sample.js:129:13)

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
      at Context.it (test/sample.js:145:11)

     Captured output of "before each" hook in "Hooks with no logs")
     before log
     Captured test output
     Fail
     End captured output



`
