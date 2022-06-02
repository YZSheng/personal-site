# Translation of `clojure.test` to JavaScript / Java developers

`clojure.test` is the unit testing framework. There are various macros that conceptually correspond to functions used in JavaScript / Java testing frameworks you might be familiar with. This is an attempt to "translate" the frequently used syntax, which hopefully will help you when you write your next Clojure test cases.

## `is`
This is like `expect(a).toEqual(b)` in JavaScript, or `assertEquals(expected, actual);` in Java. The basic usage is that `is` takes an arg which needs to evaluate to true.

```clojure
(is (= 42 (calculate-answer-to-universe))) ;; without description
(is (= 42 (calculate-answer-to-universe)) "it'd better be equal") ;; with description
```

## `testing`
This is used to organize groups of assertions, similar to [`test`](https://jestjs.io/docs/api#testname-fn-timeout) in Jest.

```clojure
(defn inc-and-multiply [a b]
  (->> [a b]
       (map inc)
       (apply *)))

;; tests
(testing "increments each number before multiplying them"
  (is (= 12 (inc-and-multiply 2 3)))
  (is (= 20 (inc-and-multiply 3 4)))
  (is (= 30 (inc-and-multiply 4 5))))
```

## `are`
Clearly, the example above is basically repeating itself with 3 groups of expected value versus input. We can simplify it by using `are` macro. This is similar to [JUnitParams](https://github.com/Pragmatists/JUnitParams).

```clojure
(deftest inc-and-multiply-test
  (are [expected a b] (= expected (inc-and-multiply a b))
    12 2 3
    20 3 4
    30 4 5))

;; run a single test, evaluates directly in REPL
(run-test inc-and-multiply-test)
```

## `deftest`
This is a higher level abstraction of a group of tests. Normally you'd find a few `testing` inside a `deftest`.

```clojure
(deftest send-todoist-request-check
  (testing "throws exception when api token is missing"
    (is (thrown? IllegalStateException (save (get-todoist nil) 1))))
  (testing "throw exception when payload is invalid"
    (is (thrown? IllegalArgumentException (save (get-todoist mock-api-token) 1)))
    (is (thrown? IllegalArgumentException (save (get-todoist mock-api-token) {:name (rand-str)})))))
```

As you have seen, the `thrown?` above is an implementation of `assert-expr` multimethod. This is similar to `assertThrows` in Junit. More importantly, given it's a multimethod, it means we can **write our own assertion expressions** here. You can find a detailed blog post about this [here](https://seespotcode.net/2018/01/13/portable-clojure-test-assert-expr/). This is similar to writing your own assertion in Hamcrest.

## `use-fixtures`
This is similar to `before`, `beforeEach`, `after` and `afterEach`, controlled by the keyword passed in. Here is the basic usage.

```clojure
(defn before-all-step []
  (println "before all step"))

(defn after-all-step []
  (println "after all step"))

(defn before-each-step []
  (println "before each step"))

(defn after-each-step []
  (println "after each step"))

(defn whole-suite-fixture [f]
  (before-all-step)
  (f)
  (after-all-step))

(defn each-fixture [f]
  (before-each-step)
  (f)
  (after-each-step))

(use-fixtures :once whole-suite-fixture)
(use-fixtures :each each-fixture)
```

So, what should it print when we run the following test? How many times will `before-each-step` and `after-each-step` run?

```clojure
(deftest my-test
  (testing "testing a"
    (is (= 1 1))
    (is (= 2 2))
    (is (= 3 3)))
  (testing "testing b"
    (is (= 1 1))
    (is (= 2 2))
    (is (= 3 3))))
```

As it turns out, `before-each-step` and `after-each-step` is only run per `deftest`.

```plaintext
before all step
before each step
after each step
after all step

Ran 1 tests containing 6 assertions.
0 failures, 0 errors.
{:test 1, :pass 6, :fail 0, :error 0, :type :summary}
```

Alright, that's all for now. Hope it's been helpful. There are still many more inside `clojure.test`, which you can read in the [official documentation](https://clojure.github.io/clojure/clojure.test-api.html).