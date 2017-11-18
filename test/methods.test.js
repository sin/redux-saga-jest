import { take } from 'redux-saga/effects'
import { next, error, cancel, NEXT, THROW, RETURN, METHOD } from '../src/methods'

describe('next(<any>): Function)', () => {

    it('should return object of shape: { [METHOD]: NEXT<String> } when called without arguments', () => {
        expect(next()).toEqual({ [METHOD]: NEXT, data: undefined })
    })

    it('should return object of shape: { [METHOD]: NEXT<String>, data<Number> } when called with number', () => {
        const input = 42
        expect(next(input)).toEqual({ [METHOD]: NEXT, data: input })
    })

    it('should return object of shape: { [METHOD]: NEXT<String>, data<Object> } when called with string', () => {
        const input = { a: 1, b: 2, c: 3 }
        expect(next(input)).toEqual({ [METHOD]: NEXT, data: input })
    })

    it('should return object of shape: { [METHOD]: NEXT<String>, data<SagaEffect> } when called with redux-saga effect', () => {
        const input = take('ACTION')
        expect(next(input)).toEqual({ [METHOD]: NEXT, data: input })
    })

})

describe('error(<any>): Function)', () => {

    it('should return object of shape: { [METHOD]: THROW<String> } when called without arguments', () => {
        expect(error()).toEqual({ [METHOD]: THROW, data: undefined })
    })

    it('should return object of shape: { [METHOD]: THROW<String>, data<Error> } when called with Error object', () => {
        const input = Error('catastrophic failure')
        expect(error(input)).toEqual({ [METHOD]: THROW, data: input })
    })

})

describe('cancel(<any>): Function)', () => {

    it('should return object of shape: { [METHOD]: RETURN<String> } when called without arguments', () => {
        expect(cancel()).toEqual({ [METHOD]: RETURN, data: undefined })
    })

    it('should return object of shape: { [METHOD]: RETURN<String>, data<String> } when called with string', () => {
        const input = 'finish'
        expect(cancel(input)).toEqual({ [METHOD]: RETURN, data: input })
    })

})