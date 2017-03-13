const assert = require('assert')
const merge = require('../../utils/merge')

describe('merge util', function() {

    it('test different keys', function(done) {
        let obj1 = { x: 0 },
            obj2 = { y: 1 }
        assert.deepEqual({ x: 0, y: 1 }, merge(obj1, obj2))
        done()
    })

    it('test equals keys', function(done) {
        let obj1 = { x: 0 },
            obj2 = { x: 1 }
        assert.deepEqual({ x: 1 }, merge(obj1, obj2))
        done()
    })

    it('test equals nested keys', function(done) {
        let obj1 = { x: 0, z: { a: 1 } },
            obj2 = { y: 1, z: { b: 1 } }
        assert.deepEqual(
            { x: 0, y: 1, z: { b: 1 } },
            merge(obj1, obj2)
        )
        done()
    })

})