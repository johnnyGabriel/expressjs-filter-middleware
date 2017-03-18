const typify = require('./utils/typify')

module.exports = {

    eq( field, val, fieldType ) {
        return typify( fieldType, val )
    },

    lt( field, val, fieldType ) {
        return { $lt: typify( fieldType, val ) }
    },

    lte( field, val, fieldType ) {
        return { $lte: typify( fieldType, val ) }
    },

    gt( field, val, fieldType ) {
        return { $gt: typify( fieldType, val ) }
    },

    gte( field, val, fieldType ) {
        return { $gte: typify( fieldType, val ) }
    },

    bt( field, val, fieldType ) {
        let split = val.split(',')
        return {
            $gt: typify( fieldType, split[0] ),
            $lt: typify( fieldType, split[1] )
        }
    }
}