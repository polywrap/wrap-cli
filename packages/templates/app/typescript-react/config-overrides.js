module.exports = function override(config, env) {
  return {
    ...config,
    optimization: {
      minimize: false
    }
  };
}
