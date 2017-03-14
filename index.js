const either = require('./utils/either')
const merge = require('./utils/merge')
const pick = require('./utils/pick')
const reduceObject = require('./utils/reduceObject')

const OPERATORS = {

    eq( field, val, fieldType ) {
        if ( fieldType == Boolean )
            var val = Number( val )
        return new fieldType( val )
    },

    lt( field, val, fieldType ) {
        return { $lt: new fieldType( val ) }
    },

    gt( field, val, fieldType ) {
        return { $gt: new fieldType( val ) }
    },

    bt( field, val, fieldType) {
        let split = val.split(',')
        return {
            $gt: new fieldType( split[0] ),
            $lt: new fieldType( split[1] )
        }
    }
}

const transformQuery = ( query, userConfig, schema ) =>
    reduceObject( query, ( acc, val, key, obj ) => {

        // check if field is queryable
        if ( !userConfig[ key ] )
            return acc

        let fieldOps = pick( userConfig[ key ], OPERATORS ),
            fieldType = either(
                schema[ key ][ 'type' ],
                schema[ key ]
            )

        // fix date(time) string with ':'
        let split = val.substr(0, 10).split(/([:])/)
        let opValue = split.slice(2).join('')
        let op = !opValue ? 'eq' : split[0]

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
    })

module.exports = ( modelSchema, userConfig ) => {

    return ( req, res, next ) => {

        req.query = transformQuery(
            req.query,
            userConfig,
            modelSchema
        )
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