const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

module.exports = {
  async setSettings(ctx) {
    const { id, contactInfo, locations } = ctx.state.user;
    const { details, detailSlot, location, locationSlot } = ctx.request.body;

    let newInfo = [...contactInfo];
    let newLocations = [...locations];

    // if details and detailSlot are provided
    if (typeof details !== "undefined" && typeof detailSlot !== "undefined") {
      newInfo[detailSlot] = details;
    } else if (
      typeof details === "undefined" &&
      typeof detailSlot !== "undefined"
    ) {
      // if there are no values but there is a slot, then delete the slot's info
      newInfo[detailSlot] = { name: "", email: "", phone: "" };
    }

    // if location and locationSlot are provided
    if (
      typeof location !== "undefined" &&
      typeof locationSlot !== "undefined"
    ) {
      newLocations[locationSlot] = location;
    } else if (
      typeof location === "undefined" &&
      typeof locationSlot !== "undefined"
    ) {
      // if there are no values but there is a slot, then delete the slot's info
      newLocations[locationSlot] = {
        street: "",
        postcode: "",
        city: "",
        state: "",
      };
    }

    let newUser = await strapi.plugins["users-permissions"].services.user.edit(
      { id },
      {
        contactInfo: newInfo,
        locations: newLocations,
      }
    );

    newUser = sanitizeUser(newUser);

    ctx.send(newUser, 200);
  },

  async changePassword(ctx) {
    const { id } = ctx.state.user;
    const { password } = ctx.request.body;

    await strapi.plugins["users-permissions"].services.user.edit(
      { id },
      {
        password,
      }
    );
    ctx.send("Password changed successfully", 200);
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    let newUser = { ...sanitizeUser(user) };
    const favorites = await strapi.services.favorite.find({ user });
    const subscriptions = await strapi.services.subscription.find({ user });

    console.log(`favorites ->`, favorites);

    // add a favorites property to newUser...
    newUser.favorites = favorites.map((favorite) => ({
      variant: favorite.product_variant.id,
      id: favorite.id,
    }));

    // add the subscriptions property...
    newUser.subscriptions = subscriptions.map((subscription) => {
      delete subscription.user;
      return subscription;
    });

    ctx.body = newUser;
  },
};
