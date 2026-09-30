function modelAssociation(sequelize) {
  const {
    product_details,
    product_images,
    product_types,
    product_categories,
    reviews,
    shopping_cart,
    user,
    orders,
    order_details,
    tracking_partners,
    similar_products,
    multi_colors
  } = sequelize.models;

  product_details.hasMany(product_images);
  product_images.belongsTo(product_details);
  product_categories.belongsTo(product_types);
  product_types.hasMany(product_categories);
  product_types.hasMany(product_details);
  product_details.hasMany(reviews);
  product_details.hasMany(multi_colors);
  multi_colors.belongsTo(product_details);
  product_details.hasMany(similar_products);
  similar_products.belongsTo(product_details);
  reviews.belongsTo(product_details);
  orders.belongsTo(tracking_partners);
  tracking_partners.hasMany(orders);
  user.hasMany(shopping_cart);
  orders.hasMany(order_details);
  order_details.belongsTo(orders);
}

module.exports = { modelAssociation };