// server.js
import express from 'express';
import courses from "./course.js";
import requestLog from './requestLog.js';
import validateCredits from './validateCredits.js';
import authToken from './authToken.js';
const app = express();
const PORT = 3000;

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
