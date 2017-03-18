module.exports = ( dest, source ) => {

    if ( dest instanceof Array )
        return dest.concat( source )

    if ( dest instanceof Object )
        return Object.assign( {}, dest, source )

    return [ dest, source ]

}
