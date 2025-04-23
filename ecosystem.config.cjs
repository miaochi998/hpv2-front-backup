module.exports = {
  apps: [
    {
      name: 'hpv2-front-dev',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'hpv2-front-prod',
      script: 'npm',
      args: 'run preview',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 