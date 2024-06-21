const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//payment ordered through Cart
exports.payment = async (req, res) => {
    const { products } = req.body
    const lineItems = products.map((product) => ({

        price_data: {
            currency: 'npr',
            product_data: {
                name: product.item_name

            },
            unit_amount: product.item_price * 100
        },
        quantity: product.quantity

    }))
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: process.env.FRONTEND_URL + '\/success\/',
        cancel_url: process.env.FRONTEND_URL + '\/failed\/'
    })
    res.json({ id: session.id })

}

exports.directPayment = async (req, res) => {
    const { items } = req.body

    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Items must be an array' });
    } else {
        console.log(items)
    }


    const lineItems = items.map((item) => ({

        price_data: {
            currency: 'npr',
            product_data: {
                name: item.name
            },
            unit_amount: item.price * 100
        },
        quantity: item.quantity

    }))


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: process.env.FRONTEND_URL + '\/success\/',
        cancel_url: process.env.FRONTEND_URL + '\/failed\/'
    })
    res.json({ id: session.id })

}

