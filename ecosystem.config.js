module.exports = {
  apps: [{
    name: 'teamManagement',
    script: 'src/index.ts',
    interpreter: 'bun',
    instances: 'max', // Use 'max' to utilize all available CPU cores
    exec_mode: 'fork', // Bun works well with fork mode for multi-processing
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_file: 'logs/pm2-combined.log',
    time: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
