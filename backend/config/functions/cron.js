"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */
const dayjs = require("dayjs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  // "*/1 * * * *": async () => {
  // "*/5 * * * * *": async () => {
  // everyday at 8am
  "0 8 * * *": async () => {
    console.log("SUBSCRIPTION RENEWING...");
    const subscriptionsToday = await strapi.services.subscription.find({
      next_delivery: dayjs().format(),
    });

    await Promise.allSettled(
      subscriptionsToday.map(async (subscription) => {
        // console.log(`subscription ->`, subscription);
        // return;
        // get user all payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: subscription.user.stripeID,
          type: "card",
        });

        // get the actual card to be charged
        const paymentMethod = paymentMethods.data.find(
          (method) => method.card.last4 === subscription.paymentMethod.last4
        );

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(subscription.product_variant.price * 1.14 * 100),
            currency: "myr",
            customer: subscription.user.stripeID,
            payment_method: paymentMethod.id,
            off_session: true,
            confirm: true,
          });

          let order = await strapi.services.order.create({
            shippingAddress: subscription.shippingAddress,
            billingAddress: subscription.billingAddress,
            shippingInfo: subscription.shippingInfo,
            billingInfo: subscription.billingInfo,
            shippingOption: { label: "subscription", price: 0 },
            subtotal: subscription.product_variant.price,
            total: subscription.product_variant.price * 1.14,
            tax: subscription.product_variant.price * 0.14,
            items: [
              {
                variant: subscription.product_variant,
                name: subscription.productName,
                quantity: subscription.quantity,
                stock: subscription.product_variant.quantity,
                product: subscription.product_variant.product,
              },
            ],
            transaction: paymentIntent.id,
            paymentMethod: subscription.paymentMethod,
            user: subscription.user.id,
            subscription: subscription.id,
          });

          // console.log(`order ->`, order);

          const emailOrderReceipt =
            await strapi.services.order.emailOrderReceipt(order);
          const frequencies = await strapi.services.order.frequency();

          await strapi.plugins["email"].services.email.send({
            to: subscription.billingInfo.email,
            subject: "Dev++ Subscription Renewed",
            html: emailOrderReceipt,
          });

          const frequency = frequencies.find(
            (option) => option.value === subscription.frequency
          );
          await strapi.services.subscription.update(
            { id: subscription.id },
            {
              next_delivery: frequency.delivery(),
              last_delivery: dayjs().format(),
            }
          );
        } catch (error) {
          // notify customer that payment failed, ask them to enter new information
          console.log(error);
        }
      })
    );
  },

  // "*/1 * * * * *": async (date) => {
  // console.log(date);
  // },
};
