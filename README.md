# mongooqs
Express.js middleware to create MongoDB queries with mongoose through querystring

## Use
Run `npm install johnnyGabriel/mongooqs` or `yarn add johnnyGabriel/mongooqs`.

On express.js/mongoose project import:

    const mongooqs = require('mongooqs')

Set express.js to use it

    app.use( mongooqs( schema, fieldsConfig ) )
    
`Object schema` mongoose schema. Access on model.Schema.obj,
    
`Object fieldsConfig` fields to query and operations* to use

e.g.

    const express = require('express')
    const mongoose = require('mongoose')
    const mongooqs = require('mongooqs')

    const User = mongoose.model('User',
        new mongoose.Schema({
            name: String,
            age: Number    
        })
    )

    const app = express()

    mongoose.connect(MONGO_SERVER)
    
    app.get('/users',
        mongooqs(User.Schema.obj, {
            age: 'eq gt lt bw'
        })
    )

    app.get('/users', (req, res) => {
        User.find(req.query, (err, data) => {
            if (!err)
                res.json(data)
        })
    })

    app.listen()

Mongo query will be on req.query

*default operations:

    eq: equal | Mongo query { field: value }
    gt: greather than | Mongo query { field: { $gt: value } }
    gte: greater than or equal | Mongo query { field: { $gte: value } }
    lt: lower than | Mongo query { field: { $lt: value } }
    lte: lower than or equal | Mongo query { field: { $lte: value } }
    bt: between | Mongo query { field: { $gt: value1, $lt: value2 } }

To extend operations:

    let { typify } = mongooqs

    mongooqs.extend({
        gte( field, val, fieldType ) {
            return { $gte: typify( fieldType, val ) }
        }
    })

    app.use('/users',
        mongooqs(User.schema.obj, {
            age: 'gte'
        })
    )


## Dev
1. Clone or download
2. Open command line and run `npm start` to install dependencies
3. That's it! Test with `npm test`
