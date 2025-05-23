// server.js
import express from 'express';
import courses from "./course.js";
const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/', (req, res)=> res.send(`${courses[0].department}`))
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    // Implementing the filter logic
    // Hint: Use the filter method to filter the courses array based on the provided criteria
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
