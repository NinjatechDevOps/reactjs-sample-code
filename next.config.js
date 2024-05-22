module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    backendUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  cssLoaderOptions: {
    url: false,
  },
  experimental: {
    headers() {
      return [
        {
          source: "/.well-known/apple-developer-merchantid-domain-association",
          headers: [{ key: "content-type", value: "application/json" }],
        },
      ];
    },
  },
};
