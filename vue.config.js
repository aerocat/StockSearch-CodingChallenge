module.exports = {
    
    // Adding proxy settings to avoid running into CORS issue
    devServer: {
	    proxy: {
            '^/api': {
                target: 'http://localhost:3000/api',
                ws: true,
                changeOrigin: true
            }
        }
    }
}
