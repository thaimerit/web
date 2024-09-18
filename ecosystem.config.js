'use strict';
module.exports = {
    apps: [
        {
            name: 'thaimerit-web',
            script: "npm",
            args: "start",
            autorestart: true,
            watch: false,
            env: {
                PORT: 3001
            }
        }
    ],
};
