"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    // make sure currently logged in user is the author/owner
    const [favorite] = await strapi.services.favorite.find({
      id,
      user: ctx.state.user.id,
    });

    if (!favorite) return ctx.unauthorized(`You can't delete this favorite`);

    const entity = await strapi.services.favorite.delete({ id });

    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },

  async userFavorites(ctx) {
    let favs = await strapi.services.favorite.find({ user: ctx.state.user.id });
    console.log(`favs ->`, favs);

    await Promise.all(
      favs.map(async (fav, i) => {
        const variants = await strapi.services["product-variant"].find({
          product: fav.product_variant.product,
        });

        variants.forEach((variant) => {
          delete variant.updated_by;
          delete variant.created_by;
        });

        favs[i].variants = variants;
        delete favs[i].user;
        delete favs[i].updated_by;
        delete favs[i].created_by;
      })
    );
    ctx.send(favs, 200);
  },
};
