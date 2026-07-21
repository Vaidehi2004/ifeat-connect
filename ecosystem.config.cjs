module.exports = {
  apps: [{
    name: "ifeat-connect",
    script: "npx",
    args: "vite preview --port 5173 --host",
    cwd: "/home/ubuntu/ifeat-connect",
    interpreter: "none",
    env: { NODE_ENV: "production" }
  }]
}