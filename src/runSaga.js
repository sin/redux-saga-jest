import { next, error, cancel, METHOD } from './methods'

const restartGenerator = ({ saga, input = {} }) => {
    const action = input[METHOD]
    return action ? saga[action](input.data) : saga.next()
}

const getSelectors = ({ value, done }) => ({
    value: () => expect(value),
    done: () => expect(done)
})

const getMethod = (method, state) => (data) => {
    state.input = method(data)
    const output = restartGenerator(state)
    return getSelectors(output)
}

const getEnhancedExpect = (state) => {
    const wrappedExpect = (expected) => expect(expected)
    const methods = {
        next: getMethod(next, state),
        error: getMethod(error, state),
        cancel: getMethod(cancel, state)
    }
    return Object.assign(wrappedExpect, methods)
}

const testMiddleware = (state, fn, ...args) => {
    const output = restartGenerator(state)
    state.input = fn(output, ...args)
}

const getEnhancedTest = (state) =>
    (name, fn) => test(name, testMiddleware.bind(null, state, fn))

const runSaga = (saga) => {
    const state = { saga, input: {} }

    const expect = getEnhancedExpect(state)
    const test = getEnhancedTest(state)

    return { expect, test, it: test }
}

export default runSaga
export {
    restartGenerator,
    getSelectors,
    getMethod
}
