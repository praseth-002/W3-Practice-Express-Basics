export default function requestLog(req, res, next) {
    const method = req.method;
    const path = req.path;
    const query = req.query;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${path} | Query:`, JSON.stringify(query));
    next();
}