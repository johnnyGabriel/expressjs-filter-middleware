const assert = require('assert')
const queryMiddleware = require('../index')

describe('query express middleware', function() {

    it('test all possibilities', function(done) {

        // model schema passed on middleware declaration
        let modelSchema = {
            status: Boolean,
            name: String,
            age: { type: Number },
            lastAccess: Date,
            totalAccess: Number,
            isGranted: Boolean
        }

        // fields that can be queryed, passed on middleware declaration
        let fieldsConfig = {
            // only perm. 'eq' op
            status: 'eq',
            // perm. all default op
            age: 'eq gt lt bt',
            // perm. all default op
            lastAccess: 'eq gt lt bt',
            // only perm. 'gt' op
            totalAccess: 'gt',
            // only perm. 'eq' and 'bt' op - this prop doesn't exist, just test
            otherField: 'eq bt',
        }

        // simulate 'app.use()'
        let middleware = queryMiddleware(modelSchema, fieldsConfig)

        // simulate a request object with query prop
        let req = {
            query: {
                // must return, have 'eq' op
                status: '1',
                // must return, have 'bt' op
                age: 'bt:18,30',
                // must return, with ms concat., have 'eq' op
                lastAccess: '2017-01-01T12:59:59',
                // must not return, field just have 'gt' op
                totalAccess: '30',
                // must not return, is not on the list
                isGranted: '1'
            }
        }

        // simulate a request occurence with middleware call
        middleware(req, {}, function() {

            let expected = {
                status: true,
                age: {
                    $gt: 18,
                    $lt: 30
                },
                lastAccess: '2017-01-01T12:59:59.000Z'
            }

            assert.equal(
                JSON.stringify(expected),
                JSON.stringify(req.query)
            )

            done()

        })

    })

})

