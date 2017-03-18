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

    const transformQuery = ( acc, val, field, obj ) => {

        // check if field is queryable
        if ( !userConfig[ field ] )
            return acc

        let fieldOperators = pick( userConfig[ field ], operators )

        let fieldOperations = ( typeof val == 'object' ) ? val : [val]

        let fieldType = !modelSchema[ field ] ?
                null : modelSchema[ field ][ 'type' ] || modelSchema[ field ]

        const transformOperation = ( acc, operation ) => {

            // avoid getting the ':' char of a datestring
            let delimiter = operation.substr( 0, 5 ).search(':')

            // if it does not have a declared op, then its a 'eq'
            let op = either(
                operation.substr( 0, delimiter ), 'eq'
            )

            let opValue = op == 'eq' ?
                operation : operation.substr( delimiter + 1 )

            // call operations
            if ( fieldOperators[ op ] ) {

                let build = fieldOperators[ op ].call(
                    {},
                    field,
                    opValue,
                    fieldType
                )

                acc[ field ] = acc[ field ] ?
                    merge( acc[ field ], build ) : build

            }

            return acc

        }

        return merge(
            acc,
            fieldOperations.reduce( transformOperation, {} )
        )

    }

    return ( req, res, next ) => {

        req.query = reduceObject( req.query, transformQuery )
        next()

    }

}

module.exports.extend = extend
module.exports.typify = typify