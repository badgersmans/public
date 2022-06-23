module.exports = ({ env }) => ({
  email: {
    provider: "postmark",
    providerOptions: {
      apiKey: env("POSTMARK_EMAIL_API_KEY"),
    },
    settings: {
      defaultMessageStream: "fyp-emails",
      defaultFrom: "SUKD1600666@segi4u.my",
      defaultTo: "SUKD1600666@segi4u.my",
      // defaultReplyTo: "code@ijs.to",
      // defaultVariables: {
      //   sentBy: 'strapi',
      // },
    },
  },
});
