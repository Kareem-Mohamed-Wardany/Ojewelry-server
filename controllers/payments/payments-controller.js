
const Order = require("../../models/Order");
const Product = require("../../models/Product");

// TODO: change paymob callback in live version with server ip.
const webhook = async (req, res) => {

    const id = req.body.obj.order.id
    const orderStatus = req.body.obj.success;

    const order = await Order.findOne({ orderId: id });

    if (!orderStatus) {
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);
            product.totalStock += item.quantity;
            await product.save();
        }
        await order.updateOne({ orderStatus: "Declined" })
    }
    else {

        await order.updateOne({ orderStatus: "Accepted" })
    }
}


module.exports = webhook;