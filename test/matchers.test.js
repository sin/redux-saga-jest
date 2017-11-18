import * as effects from 'redux-saga/effects'
import { effectsList, getMatcher } from '../src/matchers'

const matcher = getMatcher('take')

const createMock = (pass) => ({
    equals: jest.fn((a, b) => pass),
    utils: {
        matcherHint: jest.fn(_ => _),
        printReceived: jest.fn(_ => _),
        printExpected: jest.fn(_ => _)
    }
})

describe('effectsList: Array<String>', () => {

    it('should be an array', () => {
        expect(Array.isArray(effectsList)).toBe(true)
    })

    it('should not be empty', () => {
        expect(effectsList.length).toBeGreaterThan(0)
    })

    it('should contain only string values', () => {
        effectsList.forEach((value) => expect(typeof value).toBe('string'))
    })

    it('should contain only names of redux-saga effects', () => {
        effectsList.forEach((value) => expect(typeof effects[value]).toBe('function'))
    })

})

describe('getMatcher(<String>): Function', () => {

    it('should return null if called without arguments', () => {
        expect(getMatcher()).toBe(null)
    })

    it('should return null if called with effect name that desn\'t exists', () => {
        expect(getMatcher()).toBe(null)
    })

    it('should return a function if called with correct saga-effect name', () => {
        expect(typeof getMatcher('take')).toBe('function')
        expect(typeof getMatcher('put')).toBe('function')
        expect(typeof getMatcher('call')).toBe('function')
        expect(typeof getMatcher('fork')).toBe('function')
    })

})

describe('matcher(<any>, <any>): Function #1', () => {

    const PASS = false
    const mock = createMock(PASS)
    const result = matcher.call(mock)

    it('should return object of shape: { message(): Function, pass: Boolean }', () => {
        expect(result).toEqual({
            message: expect.any(Function),
            pass: expect.any(Boolean)
        })
    })

    it('should return object that has method "message" that returns a string', () => {
        expect(result.message()).toEqual(expect.any(String))
    })

    it('should return object that has property "pass" equal to false', () => {
        expect(result.pass).toBe(PASS)
    })

    it('should return a function that calls this.equals()', () => {
        expect(mock.equals).toBeCalled()
    })

    it('should return a function that calls this.equals() with two arguments', () => {
        expect(mock.equals).toBeCalledWith(undefined, effects.take())
    })

    it('should return a function that calls this.utils.matcherHint() with string', () => {
        expect(mock.utils.matcherHint).toBeCalledWith(expect.any(String))
    })

    it('should return a function that calls this.utils.printReceived() with undefined', () => {
        expect(mock.utils.printReceived).toBeCalledWith(undefined)
    })

    it('should return a function that calls this.utils.printExpected() with string', () => {
        expect(mock.utils.printExpected).toBeCalledWith(expect.any(String))
    })

})

describe('matcher(<any>, <any>): Function #2', () => {

    const ACTION_TYPE = 'ACTION_TYPE'
    const PASS = true
    const mock = createMock(PASS)
    const result = matcher.call(mock, effects.take(ACTION_TYPE), ACTION_TYPE)

    it('should return object of shape: { message(): Function, pass: Boolean }', () => {
        expect(result).toEqual({
            message: expect.any(Function),
            pass: expect.any(Boolean)
        })
    })

    it('should return object that has method "message" that returns a string', () => {
        expect(result.message()).toEqual(expect.any(String))
    })

    it('should return object that has property "pass" equal to true', () => {
        expect(result.pass).toBe(PASS)
    })

    it('should return a function that calls this.equals()', () => {
        expect(mock.equals).toBeCalled()
    })

    it('should return a function that calls this.equals() with two arguments', () => {
        expect(mock.equals).toBeCalledWith(effects.take(ACTION_TYPE), effects.take(ACTION_TYPE))
    })

    it('should return a function that calls this.utils.matcherHint() with string', () => {
        expect(mock.utils.matcherHint).toBeCalledWith(expect.any(String))
    })

    it('should return a function that calls this.utils.printReceived() with undefined', () => {
        expect(mock.utils.printReceived).toBeCalledWith(expect.any(String))
    })

    it('should return a function that calls this.utils.printExpected() with string', () => {
        expect(mock.utils.printExpected).toBeCalledWith(expect.any(String))
    })

})