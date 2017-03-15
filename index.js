const either = require('./utils/either')
const merge = require('./utils/merge')
const pick = require('./utils/pick')
const reduceObject = require('./utils/reduceObject')

const OPERATORS = {

    eq( field, val, fieldType ) {
        return convertType( fieldType, val )
    },

    lt( field, val, fieldType ) {
        return { $lt: convertType( fieldType, val ) }
    },

    gt( field, val, fieldType ) {
        return { $gt: convertType( fieldType, val ) }
    },

    bt( field, val, fieldType ) {
        let split = val.split(',')
        return {
            $gt: convertType( fieldType, split[0] ),
            $lt: convertType( fieldType, split[1] )
        }
    }
}

const convertType = ( type, val ) => {

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

module.exports = ( modelSchema, userConfig ) => {

    const transformQuery = ( acc, val, key, obj ) => {

        // check if field is queryable
        if ( !userConfig[ key ] )
            return acc

        if ( val instanceof Array )
            var val = val[0]

        let fieldOps = pick( userConfig[ key ], OPERATORS )

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

/*  Example use
app.use(
    // Schema, config >> fn
    query(
        Produto.schema, {
            price: 'eq gt lt bt',
            status: 'eq',
            date: 'eq gt lt bt'
        }
    )
)
*/