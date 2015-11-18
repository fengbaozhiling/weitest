module.exports = {
  entry: './app/js/main.js',
  output: {
    filename: './app/js/build.js'
  },
  module: {
    loaders:[
      { test: "\.jpg$", loader: "file-loader" },
      { test: "\.png$", loader: "url-loader?mimetype=image/png" }
    ]
  }
};


