let stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  lifecycles: {
    // called before an entry is created
    async beforeCreate(data) {
      const customer = await stripe.customers.create({
        name: data.username,
        email: data.email,
      });

      data.stripeID = customer.id;

      data.paymentMethods = [
        { brand: "", last4: "" },
        { brand: "", last4: "" },
        { brand: "", last4: "" },
      ];

      data.contactInfo = [
        { name: data.username, email: data.email, phone: "" },
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
      ];

      data.locations = [
        { street: "", postcode: "", city: "", state: "" },
        { street: "", postcode: "", city: "", state: "" },
        { street: "", postcode: "", city: "", state: "" },
      ];
    },
  },
};
