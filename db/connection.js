const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("connected")
        const fetch_data = mongoose.connection.db.collection('foodData')
        fetch_data.find({}).toArray()

            .then((data) => {
                // console.log(data)
                const fetch_cat = mongoose.connection.db.collection('foodCategory')
                fetch_cat.find({}).toArray()
                    .then((category) => {
                        global.category = category
                        global.sample = data
                    }).catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                console.log(err)
            })
    })

    .catch(err => console.log(err))

