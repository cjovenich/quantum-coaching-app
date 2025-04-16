module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      // ❌ Do NOT include reanimated plugin!
    };
  };
  