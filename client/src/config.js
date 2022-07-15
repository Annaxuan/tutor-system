// From lecture

const prod = {
    env: 'production',
    api_host: ''
};
const dev = {
    env: 'development',
    api_host: 'http://localhost:5002' // web server localhost port
};

export default process.env.NODE_ENV === 'production' ? prod : dev;