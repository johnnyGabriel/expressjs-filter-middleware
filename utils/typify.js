module.exports = ( type, val ) => {

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