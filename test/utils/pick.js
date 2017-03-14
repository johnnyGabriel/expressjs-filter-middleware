const assert = require('assert')
const pick = require('../../utils/pick')

describe('pick util', function() {

    it('test string key pick', function(done) {
        let obj = { x: 0, y: 1, z: 2 }
        assert.deepEqual(pick('x', obj), { x: 0 })
        done()
    })

    it('test string keys pick', function(done) {
        let obj = { x: 0, y: 1, z: 2 }
        assert.deepEqual(pick('x y', obj), { x: 0, y: 1 })
        done()
    })

    it('test array key pick', function(done) {
        let obj = { x: 0, y: 1, z: 2 }
        assert.deepEqual(pick(['x'], obj), { x: 0 })
        done()
    })

    it('test array keys pick', function(done) {
        let obj = { x: 0, y: 1, z: 2 }
        assert.deepEqual(pick(['x', 'y'], obj), { x: 0, y: 1 })
        done()
    })

})