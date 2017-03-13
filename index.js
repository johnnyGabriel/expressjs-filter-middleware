const schema = require('../rionet-api/Models/Produto').schema.obj

const either = ( case1, case2 ) =>
    case1 || case2

const merge = ( obj1, obj2 ) =>
    Object.assign( {}, obj1, obj2 )

const pick = ( keys, obj ) => {

    if ( typeof keys == 'string' )
        var keys = [ keys ]

    return keys.reduce( (acc, key) => {

        if ( obj[ key ] )
            acc[ key ] = obj[ key ]

        return acc

    }, {})

}

const reduceObject = (obj, fn) => {

    if ( typeof fn != 'function' )
        return obj

    return Object.keys( obj ).reduce( ( acc, key ) => {

        return fn( acc, obj[ key ], key, obj )

    }, {})

}

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
        return { $gt: split[0], $lt: split[1] }
    }
}

const CONFIG = {
    price: ['eq', 'gt', 'lt', 'bt'],
    status: 'eq',
    date: ['eq', 'gt', 'lt', 'bt']
}

const QUERY = {
    price: 'lt:10',
    status: '1',
    date: 'bt:2017-01-21,2017-01-23'
}

let nObj = reduceObject( QUERY, ( acc, val, key, obj ) => {

    // checa se a key é disp. pelo usuario
    if ( CONFIG[key] === undefined ) {
        return acc
    }

    let fieldOps = pick( CONFIG[ key ], OPERATORS ),
        fieldType = either(
            schema[ key ][ 'type' ],
            schema[ key ]
        )

    // this fix date string with ':'
    let split = val.split(/([:])/)
    let opValue = split.slice(2).join('')
    let op = !opValue ? 'eq' : split[0]

    // aplica ops disp. pelo usuario
    if ( fieldOps[ op ] ) {

        let fieldNewValue = fieldOps[ op ].call(
            {},
            key,
            opValue || val,
            fieldType
        )

        if ( acc[ key ] ) {
            acc[ key ] = merge( acc[ key ], fieldNewValue )
        }
        else
            acc[ key ] = fieldNewValue
            
    }

    return acc

})

console.log(
    JSON.stringify( QUERY, null, 2),
    JSON.stringify( nObj , null, 2 )
)