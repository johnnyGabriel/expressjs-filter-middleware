const either = require('./utils/either')
const merge = require('./utils/merge')
const pick = require('./utils/pick')
const reduceObject = require('./utils/reduceObject')

let operators = {

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

let typify = ( type, val ) => {

    if (!type)
        return val

    if (!val)
        return ''

    switch( type ) {

        case Boolean:
            return Boolean(
                Number( val )
            )

        case String:
            return String( val )

        case Number:
            return Number( val )

        case Date:
            return new Date( val )

        default:
            return val

    }

}

const extend = customOps =>
    Object.assign( operators, customOps )

module.exports = ( modelSchema, userConfig ) => {

    const transformQuery = ( acc, val, key, obj ) => {

        // check if field is queryable
        if ( !userConfig[ key ] )
            return acc

        if ( val instanceof Array )
            var val = val[0]

        let fieldOps = pick( userConfig[ key ], operators )

        let fieldType = !modelSchema[ key ] ?
                null : modelSchema[ key ][ 'type' ] || modelSchema[ key ]

        // avoid getting the ':' char of a datestring
        let delimiter = val.substr( 0, 5 ).search(':')

        // if it does not have a declared op, then its a 'eq'
        let op = either(
            val.substr( 0, delimiter ), 'eq'
        )

        let opValue = val.substr( delimiter + 1 )

        // call operations
        if ( fieldOps[ op ] ) {

            let fieldQuery = fieldOps[ op ].call(
                {},
                key,
                opValue || val,
                fieldType
            )

            acc[ key ] = acc[ key ] ?
                merge( acc[ key ], fieldQuery ) : fieldQuery
                
        }

        return acc
    }

    return ( req, res, next ) => {

        req.query = reduceObject( req.query, transformQuery )
        next()

    }

}

module.exports.extend = extend
module.exports.typify = typify