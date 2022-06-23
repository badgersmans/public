"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const dayjs = require("dayjs");

const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const GUEST_ID = "623413aeb5add55cc452bf11";

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

module.exports = {
  async process(ctx) {
    const {
      items,
      total,
      shippingOption,
      idempotencyKey,
      storedIntent,
      email,
      savedCard,
    } = ctx.request.body;

    let serverTotal = 0;
    let unavailable = [];

    // wait for everything to complete...
    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services["product-variant"].findOne({
          id: clientItem.variant.id,
        });

        // make sure quantity is available (item is in stock)
        if (serverItem.quantity < clientItem.quantity) {
          unavailable.push({
            id: serverItem.id,
            quantity: serverItem.quantity,
          });
        }
        // calculate total price at server side
        serverTotal += serverItem.price * clientItem.quantity;
      })
    );

    // this is only executed after everything in Promise.all has completed SUCCESSFULLY
    const shippingOptions = [
      { label: "FREE SHIPPING", price: 0 },
      { label: "2-DAY SHIPPING", price: 5 },
      { label: "OVERNIGHT SHIPPING", price: 50 },
    ];

    //   check shipping information is not tampered from client
    const shippingValid = shippingOptions.find(
      (option) =>
        option.label === shippingOption.label &&
        option.price === shippingOption.price
    );

    //   find() returns undefined if not found (meaning shipping info has been tampered)
    if (
      shippingValid === undefined ||
      ((serverTotal + shippingValid.price) * 1.14).toFixed(2) !== total
    ) {
      ctx.send({ error: "Invalid Cart" }, 400);
      //   there are some products unavailable
    } else if (unavailable.length > 0) {
      ctx.send({ unavailable }, 409);
    } else {
      if (storedIntent) {
        // update the intent
        // mutiply by 100 because stripe processes money in cents
        const update = await stripe.paymentIntents.update(
          storedIntent,
          { amount: total * 100 },
          { idempotencyKey }
        );

        ctx.send({ client_secret: update.client_secret, intentID: update.id });
      } else {
        // generate new paymentIntent
        let saved;

        if (savedCard) {
          // savedCard is only the last 4 of the card, not the actual card
          const stripePaymentMethods = await stripe.paymentMethods.list({
            customer: ctx.state.user.stripeID,
            type: "card",
          });

          // saved here is the actual card
          saved = stripePaymentMethods.data.find(
            (method) => method.card.last4 === savedCard
          );
        }

        const intent = await stripe.paymentIntents.create(
          {
            amount: total * 100,
            currency: "MYR",
            customer: ctx.state.user ? ctx.state.user.stripeID : undefined,
            receipt_email: email,
            payment_method: saved ? saved.id : undefined,
          },
          { idempotencyKey }
        );
        ctx.send({ client_secret: intent.client_secret, intentID: intent.id });
      }
    }
  },

  async finalize(ctx) {
    // console.log(`ctx.request.body ->`, ctx.request.body);
    const {
      shippingAddress,
      billingAddress,
      shippingInfo,
      billingInfo,
      shippingOption,
      subtotal,
      tax,
      total,
      items,
      transaction,
      saveCard,
      cardSlot,
      paymentMethod,
    } = ctx.request.body;

    let customerOrder;

    // check if authenticated user
    if (ctx.state.user) {
      customerOrder = ctx.state.user.id;
    } else {
      // otherwise it is a guest user
      customerOrder = GUEST_ID;
    }

    const frequencies = await strapi.services.order.frequency();

    // wait for everything to complete...
    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services["product-variant"].findOne({
          id: clientItem.variant.id,
        });

        if (clientItem.subscription) {
          const frequency = frequencies.find(
            (option) => option.label === clientItem.subscription
          );
          await strapi.services.subscription.create({
            user: customerOrder,
            product_variant: clientItem.variant.id,
            productName: clientItem.name,
            frequency: frequency.value,
            last_delivery: dayjs().format(),
            next_delivery: frequency.delivery(),
            quantity: clientItem.quantity,
            paymentMethod,
            shippingAddress,
            billingAddress,
            shippingInfo,
            billingInfo,
          });
        }

        // minus the stock quantity
        await strapi.services["product-variant"].update(
          { id: clientItem.variant.id },
          { quantity: serverItem.quantity - clientItem.quantity }
        );
      })
    );

    // if logged in and user wants to save card
    if (saveCard && ctx.state.user) {
      let newPaymentMethods = [...ctx.state.user.paymentMethods];

      newPaymentMethods[cardSlot] = paymentMethod;

      await strapi.plugins["users-permissions"].services.user.edit(
        { id: customerOrder },
        { paymentMethods: newPaymentMethods }
      );
    }

    let order = await strapi.services.order.create({
      shippingAddress,
      billingAddress,
      shippingInfo,
      billingInfo,
      shippingOption,
      subtotal,
      tax,
      total,
      items,
      transaction,
      user: customerOrder,
      paymentMethod,
    });

    order = sanitizeEntity(order, { model: strapi.models.order });

    console.log(`order ->`, order);
    const emailOrderReceipt = await strapi.services.order.emailOrderReceipt(
      order
    );

    await strapi.plugins["email"].services.email.send({
      to: order.billingInfo.email,
      subject: "Dev++ Order Confirmation",
      html: emailOrderReceipt,
    });

    // overwrite guest user to avoid leaking other guest checkout info
    if (order.user.username === "Guest") {
      order.user = { username: "Guest" };
    }
    // finally send the order.
    ctx.send({ order }, 200);
  },

  async removeCard(ctx) {
    const { card } = ctx.request.body;
    const { stripeID } = ctx.state.user;

    const stripePaymentMethods = await stripe.paymentMethods.list({
      customer: stripeID,
      type: "card",
    });

    const stripeCard = stripePaymentMethods.data.find(
      (method) => method.card.last4 === card
    );

    await stripe.paymentMethods.detach(stripeCard.id);

    let newPaymentMethods = [...ctx.state.user.paymentMethods];

    const cardSlot = newPaymentMethods.findIndex(
      (method) => method.last4 === card
    );

    newPaymentMethods[cardSlot] = { brand: "", last4: "" };

    const newUserPaymentMethods = await strapi.plugins[
      "users-permissions"
    ].services.user.edit(
      { id: ctx.state.user.id },
      { paymentMethods: newPaymentMethods }
    );

    ctx.send({ user: sanitizeUser(newUserPaymentMethods) }, 200);
  },

  async history(ctx) {
    const orders = await strapi.services.order.find({
      user: ctx.state.user.id,
    });

    const sanitizedOrders = orders.map((order) =>
      sanitizeEntity(order, { model: strapi.models.order })
    );

    ctx.send({ orders: sanitizedOrders }, 200);
  },
};
