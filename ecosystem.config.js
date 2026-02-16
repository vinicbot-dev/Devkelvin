module.exports = {
    apps: [{
        name: 'jexploit',
        script: './index.js',
        instances: 1,
        exec_mode: 'fork',
        watch: false,
        max_memory_restart: '300M',
        env: {
            NODE_ENV: 'production',
            MEMORY_LIMIT: '256'
        },
        env_low: {
            NODE_ENV: 'production',
            MEMORY_LIMIT: '128',
            NODE_OPTIONS: '--max-old-space-size=128 --optimize-for-size'
        },
        env_ultra: {
            NODE_ENV: 'production',
            MEMORY_LIMIT: '64',
            NODE_OPTIONS: '--max-old-space-size=64 --optimize-for-size --gc-interval=50'
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true,
        kill_timeout: 5000,
        listen_timeout: 3000
    }]
};