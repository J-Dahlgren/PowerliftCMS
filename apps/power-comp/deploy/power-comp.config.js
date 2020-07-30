module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "power-comp",
      script: "dist/apps/power-comp/api/main.js",
      env: {
        NODE_ENV: "development",
        PORT: 3334
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3334
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "jesper",
      host: "jdahlgren.ddns.net",
      ref: "origin/master",
      repo: "git@github.com:J-Dahlgren/power-comp.git",
      ssh_options: [
        "StrictHostKeyChecking=no",
        "PasswordAuthentication=no",
        "ForwardAgent=yes"
      ],
      path: "/home/jesper/services/power-comp",

      "post-deploy":
        "npm install && npm prune" +
        " && git reset --hard" + // Fix any modifications to the lock file
        " && npx nx build power-comp-deploy" +
        " && pm2 startOrRestart apps/power-comp/deploy/power-comp.config.js --env=production" +
        " && pm2 save"
    }
  }
};
