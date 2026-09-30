const UserRole = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
};

const OrderStatus = {
  ORDER_PLACED: "Order Placed",
  ORDER_CONFIRMED: "Order Confirmed",
  DISPATCHED: "Dispatched",
  CANCEL_REQUESTED: "Cancel Requested",
  COMPLETED: "Completed",
  REFUNDED: "Refunded"
};

module.exports = {
  OrderStatus,
  UserRole,
};
