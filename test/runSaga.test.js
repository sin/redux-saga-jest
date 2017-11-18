import { put, take } from 'redux-saga/effects'
import { error, NEXT, THROW, RETURN, METHOD } from '../src/methods'
import { restartGenerator, getSelectors, getMethod, getEnhancedExpect, testMiddleware } from '../src/runSaga'
import runSaga from '../src/index'

const createStateMock = (method, data) => ({
    saga: {
        next: jest.fn(data => ({ method: NEXT, data })),
        throw: jest.fn(data => ({ method: THROW, data })),
        return: jest.fn(data => ({ method: RETURN, data }))
    },
    input: {
        [METHOD]: method,
        data
    }
})

const createOutputMock = (value, done) => ({ value, done })

describe('#1 restartGenerator(state<Object>): Function when input[METHOD] is undefined', () => {

    const mock = createStateMock(undefined, Symbol('data'))
    const result = restartGenerator(mock)

    it('should call saga interface method next()', () => {
        expect(mock.saga.next).toBeCalled()
        expect(result.method).toBe(NEXT)
    })

    it('should call saga interface method next() without data', () => {
        expect(result.data).toBe(undefined)
    })

    it('shouldn\'t call saga interface method throw() or return()', () => {
        expect(mock.saga.throw).not.toBeCalled()
        expect(mock.saga.return).not.toBeCalled()
    })

})

describe('#2 restartGenerator(state<Object>): Function when input[METHOD] is NEXT', () => {

    const mock = createStateMock(NEXT, Symbol('data'))
    const result = restartGenerator(mock)

    it('should call saga interface method next()', () => {
        expect(mock.saga.next).toBeCalled()
        expect(result.method).toBe(NEXT)
    })

    it('should call saga interface method next() with data', () => {
        expect(result.data).toBe(mock.input.data)
    })

    it('shouldn\'t call saga interface method throw() or return()', () => {
        expect(mock.saga.throw).not.toBeCalled()
        expect(mock.saga.return).not.toBeCalled()
    })

})

describe('#3 restartGenerator(state<Object>): Function when input[METHOD] is THROW', () => {

    const mock = createStateMock(THROW, Symbol('data'))
    const result = restartGenerator(mock)

    it('should call saga interface method throw()', () => {
        expect(mock.saga.throw).toBeCalled()
        expect(result.method).toBe(THROW)
    })

    it('should call saga interface method throw() with data', () => {
        expect(result.data).toBe(mock.input.data)
    })

    it('shouldn\'t call saga interface method next() or return()', () => {
        expect(mock.saga.next).not.toBeCalled()
        expect(mock.saga.return).not.toBeCalled()
    })

})

describe('#4 restartGenerator(state<Object>): Function when input[METHOD] is RETURN', () => {

    const mock = createStateMock(RETURN, Symbol('data'))
    const result = restartGenerator(mock)

    it('should call saga interface method return()', () => {
        expect(mock.saga.return).toBeCalled()
        expect(result.method).toBe(RETURN)
    })

    it('should call saga interface method return() with data', () => {
        expect(result.data).toBe(mock.input.data)
    })

    it('shouldn\'t call saga interface method next() or throw()', () => {
        expect(mock.saga.next).not.toBeCalled()
        expect(mock.saga.throw).not.toBeCalled()
    })

})

describe('getSelectors(output<Object>): Function', () => {

    const value = Symbol('val')
    const mock = createOutputMock(value, false)
    const result = getSelectors(mock)

    it('should return object of shape: { value: Function, done: Function }', () => {
        expect(result).toEqual({
            value: expect.any(Function),
            done: expect.any(Function)
        })
    })

    it('should return value() method that returns jest/expect object', () => {
        // here be dragons
        result.value().toBe(value)
    })

    it('should return done() method that returns jest/expect object', () => {
        // here be dragons
        result.done().toBe(false)
    })

})

describe('getMethod(method<Function>, state<Object>): Function', () => {

    const data = Symbol('data')
    const mock = createStateMock(NEXT, data)
    const func = getMethod(error, mock)
    const result = func()

    it('should return a function', () => {
        expect(typeof func).toBe('function')
    })

    it('should mutate mock state object with error()\'s output', () => {
        expect(mock.input).toEqual(error())
    })

    it('should return a function that returns object of shape: { value: Function, done: Function }', () => {
        expect(result).toEqual({
            value: expect.any(Function),
            done: expect.any(Function)
        })
    })

})

describe('getMethod(method<Function>, state<Object>): Function', () => {

    const data = Symbol('data')
    const state = createStateMock(NEXT, data)
    const func = getMethod(error, state)
    const result = func()

    it('should return a function', () => {
        expect(typeof func).toBe('function')
    })

    it('should mutate state object with error()\'s output', () => {
        expect(state.input).toEqual(error())
    })

    it('should return a function that returns object of shape: { value: Function, done: Function }', () => {
        expect(result).toEqual({
            value: expect.any(Function),
            done: expect.any(Function)
        })
    })

})

describe('getEnhancedExpect(state<object>): Function', () => {

    const state = createStateMock()
    const result = getEnhancedExpect(state)

    it('should return a function', () => {
        expect(typeof result).toEqual('function')
    })

    it('should return a function with methods next(), error(), cancel()', () => {
        expect(typeof result.next).toEqual('function')
        expect(typeof result.error).toEqual('function')
        expect(typeof result.cancel).toEqual('function')
    })
})

describe('testMiddleware(state<Object>, fn<Function>, ...args<any>): Function', () => {

    const args = ['a', 'b', 'c']
    const data = Symbol('data')
    const state = createStateMock(NEXT, data)
    const fn = jest.fn(({ value, done }, ...args) => args.join())
    testMiddleware(state, fn, ...args)

    it('should mutate state with fn\'s output', () => {
        expect(state.input).toBe(args.join())
    })
})

describe('getEnhancedTest(state<Object>): Function', () => {

    it('should not be tested, dragons', () => {
        expect(true).toBe(true)
    })

})

describe('#1 runSaga(saga<Function>): Function', () => {

    function* simpleGenerator() {
        yield 1
        yield 2
        yield 3
    }

    const { it, expect } = runSaga(simpleGenerator())

    it('should run and test simple generator', ({ value }) => {
        expect(value).toBe(1)
        expect.next().value().toBe(2)
        expect.next().value().toBe(3)
        expect.next().done().toBe(true)
    })

})

describe('#2 runSaga(saga<Function>): Function', () => {

    function* simpleSaga() {
        yield put({ type: 'ACTION', payload: 1})
        const payload = yield take('ACTION')
        yield put({ type: 'ACTION', payload })
    }

    const { it, expect } = runSaga(simpleSaga())

    it('should run and test simple saga', ({ value }) => {
        expect(value).put({ type: 'ACTION', payload: 1 })
        expect.next().value().take('ACTION')
        expect.next(5).value().put({ type: 'ACTION', payload: 5 })
        expect.next().done().toBe(true)
    })

})
