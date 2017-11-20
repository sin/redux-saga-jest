# redux-saga-jest

> Helper library for testing redux sagas in jest.

`redux-saga-jest` extends `expect` with useful [matchers](https://facebook.github.io/jest/docs/en/expect.html) that let you easily validate saga effects, and binds your sagas to `test` (`it` alias is also available) and `expect` functions, providing an easy way to control saga's execution.

## Installation

Install `redux-saga-jest` using [yarn](https://yarnpkg.com/):

```
$ yarn add redux-saga-jest --dev
```

Or via [npm](https://www.npmjs.com/):

```
$ npm install redux-saga-jest --save-dev
```

## Getting Started

Let's start writing tests for a simple generator (yes, you can use `redux-saga-jest` to test plain generators, too):

```javascript
function* simpleGenerator() {
    let msg, n = 1
    while (n < 3) {
        msg = yield msg || n
        n++
    }
}
```

You will need to import `runSaga` function from `redux-saga-jest` and call it with your generator's iterator as an argument. It'll return an object containing enhanced `test`, `it` and `expect` functions. `redux-saga-jest` will iterate over the generator when you call `it` and provide the yielded value and done flag as first argument in your test function.

```javascript
import runSaga from 'redux-saga-jest'

describe('simpleGenerator', () => {
    const { it, expect } = runSaga(simpleGenerator())

    it('should yield 1', ({ value }) => {
        expect(value).toBe(1)
    })

    it('then should yield 2', ({ value }) => {
        expect(value).toBe(2)
    })

    it('then should finish', ({ value, done }) => {
        expect(value).toBeUndefined()
        expect(done).toBe(true)
    })
})
```

You can return from your test function to tell `redux-saga-jest` to send data to generator, terminate it, or signal an error, using special functions `next`, `cancel` and `error` respectively. These functions works much like `redux-saga` effects, returning an object that tells `redux-saga-jest` what to do next, rather than resuming execution of generator immediately.

```javascript
import runSaga, { next } from 'redux-saga-jest'

describe('simpleGenerator', () => {
    const { it, expect } = runSaga(simpleGenerator())

    it('should yield 1', ({ value }) => {
        expect(value).toBe(1)
        return next('foo')
    })

    it('then should yield "foo"', ({ value }) => {
        expect(value).toBe('foo')
    })

    it('then should finish', ({ value, done }) => {
        expect(value).toBeUndefined()
        expect(done).toBe(true)
    })
})
```

Alternatively, use equivalent methods of `expect`. This will resume the generator immediately and allow you to assert yielded values using method chaining.

```javascript
import runSaga from 'redux-saga-jest'

describe('simpleGenerator', () => {
    const { it, expect } = runSaga(simpleGenerator())

    it('should yield 1, then yield "bar", then finish', ({ value }) => {
        expect(value).toBe(1)
        expect.next('bar').value().toBe('bar')
        expect.next().done().toBe(true)
    })
})
```

For the most part testing sagas is no different from testings plain generators.

`redux-saga` effects are plain objects, so it's a common practice to test sagas using `toEqual`, but it's a little verbose and requires importing `redux-saga` effects in your tests. `redux-saga-jest` makes it more concise using custom matchers.

Consider the following saga:

```javascript
import { put, take } from 'redux-saga/effects'

function* simpleSaga() {
    yield put({ type: 'FOO', payload: 1})
    const payload = yield take('BAR')
    yield put({ type: 'BAZ', payload })
}
```

You can test it like this:

```javascript
import runSaga, { next } from 'redux-saga-jest'
import simpleSaga from './simpleSaga'

describe('simpleSaga', () => {
    const { it, expect } = runSaga(simpleSaga())

    it('should put an action "FOO" with payload 1', ({ value }) => {
        expect(value).put({ type: 'FOO', payload: 1 })
    })

    it('should take an action "BAR"', ({ value }) => {
        expect(value).take('BAR')
        return next(5)
    })

    it('should put an action "BAZ" with payload 5', ({ value }) => {
        expect(value).put({ type: 'BAZ', payload: 5 })
    })

    it('then should finish', ({ value, done }) => {
        expect(value).toBeUndefined()
        expect(done).toBe(true)
    })
})
```

## License

Licensed under the [MIT License](https://github.com/sin/redux-saga-jest/blob/master/LICENSE).
