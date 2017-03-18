const assert = require('assert')
const mongooqs = require('../index')

describe('mongooqs express middleware', function() {

    it('test fieldsConfig', function(done) {

        let modelSchema = {
            field1: Number,
            field2: String,
            field3: Number,
            field4: Boolean,
            field5: String,
            field7: Number
        }

        let fieldsConfig = {
            field1: 'eq',
            field2: 'gt lt bt',
            field3: 'eq bt',
            field4: 'eq',
            field5: 'eq',
            field6: 'eq gt lt bt',
            field7: 'eq'
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                field1: 'gt:5',
                field2: 'lorem',
                field3: 'lt:10',
                field4: 'bt:0,1',
                field5: 'lorem',
                field6: '10',
                field7: ['10', '20']
            }
        }

        middleware(req, {}, function() {

            let expected = {
                field5: 'lorem',
                field6: '10',
                field7: [10, 20]
            }

            assert.deepEqual(req.query, expected)

            done()

        })

    })
        
    it('test Date operations', function(done) {

        let modelSchema = {
            dateField1: Date,
            dateField2: Date,
            dateField3: Date,
            dateField4: Date
        }

        let fieldsConfig = {
            dateField1: 'eq',
            dateField2: 'gt',
            dateField3: 'lt',
            dateField4: 'bt',
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                dateField1: '2017-01-01',
                dateField2: 'gt:2017-01-01',
                dateField3: 'lt:2017-01-01',
                dateField4: 'bt:2017-01-01,2017-01-05'
            }
        }

        middleware(req, {}, function() {

            let expected = {
                dateField1: new Date('2017-01-01'),
                dateField2: { $gt: new Date('2017-01-01') },
                dateField3: { $lt: new Date('2017-01-01') },
                dateField4: {
                    $gt: new Date('2017-01-01'),
                    $lt: new Date('2017-01-05')
                }
            }

            assert.deepEqual(req.query, expected)
            done()


        })


    })

    it('test Number operations', function(done) {

        let modelSchema = {
            numberField1: Number,
            numberField2: Number,
            numberField3: Number,
            numberField4: Number
        }

        let fieldsConfig = {
            numberField1: 'eq',
            numberField2: 'gt',
            numberField3: 'lt',
            numberField4: 'bt',
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                numberField1: '1',
                numberField2: 'gt:1',
                numberField3: 'lt:10',
                numberField4: 'bt:1,10'
            }
        }

        middleware(req, {}, function() {

            let expected = {
                numberField1: 1,
                numberField2: { $gt: 1 },
                numberField3: { $lt: 10 },
                numberField4: {
                    $gt: 1,
                    $lt: 10
                }
            }

            assert.deepEqual(req.query, expected)
            done()


        })


    })

    it('test Boolean operations', function(done) {

        let modelSchema = {
            boolField1: Boolean,
            boolField2: Boolean
        }

        let fieldsConfig = {
            boolField1: 'eq',
            boolField2: 'eq'
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                boolField1: '1', 
                boolField2: '0'
            }
        }

        middleware(req, {}, function() {

            let expected = {
                boolField1: true,
                boolField2: false
            }

            assert.deepEqual(req.query, expected)

            done()

        })

    })

    it('test String operations', function(done) {

        let modelSchema = {
            stringField: String
        }

        let fieldsConfig = {
            stringField: 'eq'
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                stringField: 'lorem'
            }
        }

        middleware(req, {}, function() {

            let expected = {
                stringField: 'lorem'
            }

            assert.deepEqual(req.query, expected)

            done()

        })

    })

    it('test all operators', function(done) {

        let modelSchema = {
            fieldEq: String,
            fieldGt: Number,
            fieldGte: Number,
            fieldLt: Number,
            fieldLte: Number,
            fieldBt: Number
        }

        let fieldsConfig = {
            fieldEq: 'eq',
            fieldGt: 'gt',
            fieldGte: 'gte',
            fieldLt: 'lt',
            fieldLte: 'lte',
            fieldBt: 'bt'
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                fieldEq: 'lorem',
                fieldGt: 'gt:5',
                fieldGte: 'gte:10',
                fieldLt: 'lt:15',
                fieldLte: 'lte:15',
                fieldBt: 'bt:1,10'
            }
        }

        middleware(req, {}, function() {

            let expected = {
                fieldEq: 'lorem',
                fieldGt: { $gt: 5 },
                fieldGte: { $gte: 10 },
                fieldLt: { $lt: 15 },
                fieldLte: { $lte: 15 },
                fieldBt: { $gt: 1, $lt: 10 }
            }
            assert.deepEqual(req.query, expected)
            done()

        })

    })

    it('test multiple operations per field', function(done) {

        let modelSchema = {
            field: Number
        }

        let fieldsConfig = {
            field: 'gt lt'
        }

        let middleware = mongooqs(modelSchema, fieldsConfig)

        let req = {
            query: {
                field: ['gt:5', 'lt:10']
            }
        }

        middleware(req, {}, function() {

            let expected = {
                field: { $gt: 5, $lt: 10 }
            }

            assert.deepEqual(req.query, expected)

            done()

        })
        
    })

    it('test custom operators', function(done) {

        let { typify } = mongooqs

        mongooqs.extend({
            cc (field, val, fieldType) {
                return { $cc: typify(fieldType, val) }
            }
        })

        let modelSchema = { field: Number }
        let fieldsConfig = { field: 'cc' }
        let middleware = mongooqs(modelSchema, fieldsConfig)
        let req = {
            query: {
                field: 'cc:50'
            }
        }

        middleware(req, {}, function() {

            let expected = { field: { $cc: 50 } }
            assert.deepEqual(req.query, expected)
            done()

        })

    })

})

