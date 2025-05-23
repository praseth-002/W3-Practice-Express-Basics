export default function authToken(req, res, next) {
    const token = req.query.token;
    const VALID_TOKEN = 'tokentest';
    if (!token || token !== VALID_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
    }
    next(); 
}