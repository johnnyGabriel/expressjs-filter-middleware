const assert = require('assert')
const reduceObject = require('../../utils/reduceObject')

describe('reduceObject util', function() {

    it('simple test', function(done) {

        let obj = { x: 0, y: 1, z: null }
        let reduced = reduceObject(obj, function(acc, val, key) {
            if (val)
                acc[ key ] = val
            return acc
        }, {})
        assert.deepEqual(reduced, { y: 1 })
        done()

    })

})