module.exports = {
  entry: './js/app.js',
  output: {
    filename: './js/build.js'
  },
  module: {
    loaders:[
      { test: "\.jpg$", loader: "file-loader" },
      { test: "\.png$", loader: "url-loader?mimetype=image/png" }
    ]
  }
};


