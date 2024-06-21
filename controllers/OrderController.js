const OrderItem = require('../models/orderItemModel')
const OrderModel = require('../models/OrderModel')


//post order

exports.postOrder = async (req, res) => {
    //post data to orderitemmodel and return the id of that data
    const orderItemIds = Promise.all(req.body.orderItem.map(async orderItemData => {
        let newOrderItem = new OrderItem({
            quantity: orderItemData.quantity,
            item: orderItemData.item,
            item_name: orderItemData.item.item_name


        })
        newOrderItem = await newOrderItem.save()   // this will  gengnerate an id
        return newOrderItem._id  //this will return value to line number 9
    }))
    const orderItemIdResolved = await orderItemIds   // this id must be passed in orderModel

    //calculate total price

    const totalAmount = await Promise.all(orderItemIdResolved.map(async orderId => {
        const itemOrder = await OrderItem.findById(orderId).populate('item', 'item_price')
        const total = itemOrder.quantity * itemOrder.item.item_price
        return total
        //
    }))

    const totalPrice = totalAmount.reduce((a, b) => a + b, 0)

    //post data to Order model

    let order = new OrderModel({
        orderItem: orderItemIdResolved,
        shippingAddress1: req.body.shippingAddress1,
        totalPrice: totalPrice,
        user: req.body.user,

        quantity: orderItemIdResolved.quantity,
        contact: req.body.contact



    })

    order = await order.save()
    if (!order) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(order)
}

//Order List

exports.orderList = async (req, res) => {
    const orderList = await OrderModel.find()
        .populate({
            path: 'orderItem', populate: {
                path: 'item', populate: 'item_name'
            }
        })
        .populate({ path: 'user', select: 'name' })
        .sort({ createdAt: -1 })

    if (!orderList) {
        return res.status(400).json({ error: 'list not fetched' })
    }
    res.send(orderList)

}

//order detail

exports.orderDetail = async (req, res) => {
    const orderDetail = await OrderModel.findById(req.params.id)
        .populate('user', 'name')

        .populate({
            path: 'orderItem', populate: {
                path: 'item', populate: 'item_name'
            }
        })
    if (!orderDetail) {
        return res.status(400).json({ error: 'order not fetched' })
    }
    res.send(orderDetail)
}

//update status

exports.updateStatus = async (req, res) => {
    const updateStatus = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }

    )
    if (!updateStatus) {
        return res.status(400).json({ error: 'update status not found' })
    }
    res.send(updateStatus)
}

//order list of specific user

exports.userOrderList = async (req, res) => {
    const userorderlist = await OrderModel.find({ user: req.params.userid })
        .populate({
            path: 'orderItem', populate: {
                path: 'item', select: 'item_name'
            }
        })
        .sort({ createdAt: -1 })
        .lean();
    if (!userorderlist) {
        return res.status(400).json({ error: 'user order list  not found' })
    }
    res.send(userorderlist)
}


//delete order
exports.deleteOrder = async (req, res) => {
    const id = req.params.id
    OrderModel.findByIdAndDelete(id)
        .then((item) => {
            if (!item) {
                return res.status(403).json({ error: 'Order not found' })
            }
            else {
                return res.status(200).json({ message: 'order deleted' })
            }
        }).catch(err => {
            return res.status(400).json({ error: err })
        })
}
