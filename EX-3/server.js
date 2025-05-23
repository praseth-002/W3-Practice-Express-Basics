// server.js
import express from 'express';
import courses from "./course.js";
const app = express();
const PORT = 3000;

function requestLog(req, res, next) {
    const method = req.method;
    const path = req.path;
    const query = req.query;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${path} | Query:`, JSON.stringify(query));
    next();
}

function validateCredits(req, res, next) {
    const { minCredits, maxCredits } = req.query;
    if (minCredits && isNaN(parseInt(minCredits))) {
        return res.status(400).json({ error: "minCredits must be an integer" });
    }
    if (maxCredits && isNaN(parseInt(maxCredits))) {
        return res.status(400).json({ error: "maxCredits must be an integer" });
    }
    if (
        minCredits && maxCredits &&
        parseInt(minCredits) > parseInt(maxCredits)
    ) {
        return res.status(400).json({ error: "minCredits cannot be greater than maxCredits" });
    }
    next();
};

function authToken(req, res, next) {
    const token = req.query.token;
    const VALID_TOKEN = 'tokentest';
    if (!token || token !== VALID_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
    }
    next(); 
}

app.use(requestLog);
app.use(authToken);
app.get('/', (req, res)=> res.send(`${courses[0].department}`))
app.get('/departments/:dept/courses', validateCredits, (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    if (minCredits && maxCredits && parseInt(minCredits) > parseInt(maxCredits)) {
        return res.status(400).json({ error: "minCredits cannot be greater than maxCredits" });
    };
    const found = courses.filter (
        course => course.department == dept &&
        (!level || course.level == level) &&
        (!minCredits || course.credits >= parseInt(minCredits)) &&
        (!maxCredits || course.credits <= parseInt(maxCredits)) &&
        (!semester || course.semester == semester) &&
        (!instructor || course.instructor.toLowerCase().includes(instructor.toLowerCase()))
    );
    res.json(found);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
