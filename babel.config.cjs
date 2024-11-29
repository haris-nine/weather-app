module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }], // Modern JavaScript support
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
}
