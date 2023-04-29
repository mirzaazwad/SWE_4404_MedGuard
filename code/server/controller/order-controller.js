const Order = require('../model/order-model');

const postOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const  items  = req.body.items;
    const customer_data  = req.body.customer_data;

    const order = await Order.findOne({ userId: userId });

    if (order) {
      order.order_data.push({
        date: new Date(),
        medicines:items,
        customer_data: customer_data
      });
      await order.save();
      console.log("order saved");
      return res.status(200);
    }
    console.log("order not found");
    const newOrder = new Order({
      userId,
      order_data: [
        {
          date: new Date(),
          medicines : items,
          customer_data: customer_data
        }
      ]
    });

    await newOrder.save();
    
    return res.status(200);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getOrder = async (req, res) => {
  try {
    const  userId  = req.params.userId;
    console.log(userId);
    const order = await Order.findOne({ userId:userId });

    if (!order) {
      console.log("order not found");
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { postOrder, getOrder };
