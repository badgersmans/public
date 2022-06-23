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
      entity = await strapi.services.review.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.review.create(ctx.request.body);
    }
    await strapi.services.review.average(entity.product.id);
    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    // make sure currently logged in user is the author of the review
    const [review] = await strapi.services.review.find({
      id,
      user: ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't edit this review`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.review.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.review.update({ id }, ctx.request.body);
    }
    await strapi.services.review.average(entity.product.id);

    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    // make sure currently logged in user is the author of the review
    const [review] = await strapi.services.review.find({
      id,
      user: ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't delete this review`);
    }

    const entity = await strapi.services.review.delete({ id });

    await strapi.services.review.average(entity.product.id);

    return sanitizeEntity(entity, { model: strapi.models.review });
  },
};
