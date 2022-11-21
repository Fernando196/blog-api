module.exports = {
  apps: [{
    name: "blog",
    script: "./src/api/index-blog.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}