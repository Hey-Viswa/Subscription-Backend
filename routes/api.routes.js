import { Router } from 'express';

const apiRouter = Router();

// API documentation route
apiRouter.get('/', (req, res) => {
    // Get Express app instance
    const app = req.app;
    
    // Get all registered routes
    const routes = [];
    
    // Function to get route paths
    const getRoutePaths = (stack, basePath = '') => {
        stack.forEach(layer => {
            if (layer.route) {
                // Routes registered directly
                const methods = Object.keys(layer.route.methods)
                    .filter(method => layer.route.methods[method])
                    .map(method => method.toUpperCase());
                
                routes.push({
                    path: basePath + layer.route.path,
                    methods: methods.join(', '),
                    middleware: layer.route.stack.length > 1 ? 'Yes' : 'No'
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                // Router middleware
                const routerPath = layer.regexp.source
                    .replace('^\\/','')
                    .replace('\\/?(?=\\/|$)', '')
                    .replace(/\\\//g, '/');
                
                let newBase = basePath;
                if (routerPath !== '(?:\\/)?$') {
                    newBase = basePath + '/' + routerPath.replace(/\(\?:\\\/\)\?\$/g, '');
                }
                
                getRoutePaths(layer.handle.stack, newBase);
            }
        });
    };

    // Get routes from app._router
    if (app._router && app._router.stack) {
        getRoutePaths(app._router.stack);
    }

    // Return the API documentation
    res.status(200).json({
        success: true,
        message: 'API Routes',
        data: {
            routes: routes.filter(r => !r.path.includes('*')),
            baseUrl: `${req.protocol}://${req.get('host')}`
        }
    });
});

export default apiRouter;
