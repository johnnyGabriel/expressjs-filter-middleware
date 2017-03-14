module.exports = ( keys, obj ) => {

    if ( typeof keys == 'string' )
        var keys = keys.split(' ')

    return keys.reduce( (acc, key) => {

        if ( Object.keys( obj ).indexOf( key ) > -1 )
            acc[ key ] = obj[ key ]

        return acc

    }, {})

}