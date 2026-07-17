module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix ESM resolution for @floating-ui/react jsx-runtime with React 17
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    },
  },
};