module.exports = (obj, fn) => {

    if ( typeof fn != 'function' )
        return obj

    return Object.keys( obj ).reduce( ( acc, key ) => {

        return fn( acc, obj[ key ], key, obj )

    }, {})

}