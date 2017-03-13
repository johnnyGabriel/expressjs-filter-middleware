const assert = require('assert')
const either = require('../../utils/either')

describe('either util', function() {

    it('logical test', function(done) {
        assert.equal(true, either( false, true ))
        assert.equal(1, either( 0, 1 ))
        done()
    })

    it('test obj undefined key', function(done) {
        let obj = { x: 'its me' }
        assert.equal('its me', either( obj.z, obj.x ))
        done()
    })

    it('test array undefined index', function(done) {
        let array = ['string 1', 'string 2']
        assert.equal('string 1', either( array[2], array[0] ))
        done()
    })

    it('test invalid values', function(done) {
        assert.equal(1, either( '', 1 ))
        assert.equal(1, either( false, 1 ))
        assert.equal(1, either( null, 1 ))
        assert.equal(1, either( undefined, 1 ))
        done()
    })

})