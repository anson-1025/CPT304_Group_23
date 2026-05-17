require("dotenv").config();

const app = require("./app");

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});