# Unit Testing in Clojure

## Motivation

As I'm digging deeper into Clojure development and ecosystem, here are some of my findings so far concerning unit testing in Clojure.

## Testing code with side effect

I was earlier working on a project where I fire outbound http calls using [clj-http](https://github.com/dakrone/clj-http) library. While I was writing unit test, I wasn't sure how to do it. I have pushed the side effect stuff all the way to the boundary of the system, where everything before that / inside is pure. just passing values around. But how should I test a function that takes some value then fires a request?

```clojure
(defn save-todo [[todo api-token]]
  (client/post endpoint-url {:headers {"Authorization" (str "Bearer " api-token)}
                                 :content-type :json
                                 :body (generate-payload todo)}))
```

So how should I verify that `client/post` has been called with correct headers, payload, etc? I felt like I was reaching for a stub in other languages. I did some research and although there are indeed mocking libraries out there for Clojure, I felt I didn't need one for such a simple case. Clojure allows you to redefine the function body for a given function name var.

```clojure
(deftest send-todo-request-payload
  (testing "sends correct payload to endpoint"
    (with-redefs [client/post (fn [& args] (vec args))]
      (let [expected [expected-url {:headers {"Authorization" (str "Bearer " api-token)}
                                                               :content-type :json
                                                               :body expected-body}]]
        (is (= expected (save-todo [todo api-token])))))))
```

Here we redefine the `post` call to return a vector of all its arguments, then we simply assert on the vec. Sweet! What's missing here are things like how many times it has been called, and order of each call. We can either hand roll the feature (shouldn't be that hard I guess? with a `atom`?) or use a (library)[https://github.com/unrelentingtech/clj-http-fake].

## Test Driven Development (TDD)

Normally I would say that TDD is a great approach to gradually grow a piece of software, from the most basic requirement all the way up. I've used it in Kotlin and JavaScript / TypeScript projects, and find it particularly helpful when I need to work on purely domain centric logic, without external dependencies such as UI. _(Honestly I'm not a big fan of building UI code following TDD as the feedback I'm seeking is more from my eyes than test runner. However code like redux reducers would be a good fit.)_

With Clojure, however, given the power of its REPL, I find it not necessary to go through the TDD cycles. Or, rather, I'm always doing TDD in a way, just without running a test runner or writing unit tests all the time. I find myself constantly evaluating little expressions in REPL, see if it works, then make a bit more changes and repeat. Once I arrive at a working solution, I use the same REPL data to create a unit test for that newly written function.

Let's take a step back and examine why we want to do TDD.

### Fast feedback loop

This is really the power of REPL shines in languages like Clojure. Evaluating an expression in REPL is instant, and there is really no need to `watch` or run any test runner to see if you've made the correct changes.

### Incremental changes

For me, the rhythm fostered by REPL driven development in a functional language already encourages incremental steps. I find myself always end up gravitating towards building multiple small pure functions first, testing them in REPL, then composing into a function that does a more complex thing.

### A good suite of tests

Yes I admit that in Clojure's REPL driven approach, the resulting test suites are usually not as comprehensive as traditional TDD approach in my experience. However, TDD is not the only valuable approach for testing, albeit a very good one. And the tests are covering as much as conditions you have thought of when writing the test cases. 100% coverage doesn't mean it works 100% of the time. This is where [generative testing](https://clojure.github.io/test.generative/) / [property based testing](https://clojure.org/guides/test_check_beginner) starts to shine.
