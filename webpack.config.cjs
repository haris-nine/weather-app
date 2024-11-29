const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'eval-source-map',
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true, // This enables watching of files in the static directory
    },
    watchFiles: ['src/**/*.html'], // Add specific files/patterns to watch
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'], // File types to lint
      overrideConfigFile: path.resolve(__dirname, 'eslint.config.mjs'),
      configType: 'flat',
      emitWarning: true, // Show warnings in Webpack output
      files: 'src/**/*', // Run ESLint only on files in the src folder
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Matches all .js files
        exclude: /node_modules/, // Don't process node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Uses preset-env for modern JS features
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name][hash][ext][query]', // Output path pattern
        },
      },
    ],
  },
}
