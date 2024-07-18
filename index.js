// Importing require modules
const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 8000;



// *******************************************************************

//Middleware - or you can say that Plugin

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}: ${req.method}: ${req.path}\n`, (err, data) => {
        next();
    })
})


// ********************************************************************

// Routes 

app.get('/', (req, res) => {
    return res.send('hello from server');
})


// for web app we send html which is SSR(Server Side Rendering)
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
}) 


// for mobile app we send json 
app.get('/api/users', (req, res) => {
    // console.log(req);
    return res.json(users);
})


app.route("/api/users/:id")
.get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((item) => id === item.id)

    return res.json(user);
})
.patch((req, res) => {
    //Edit user with id
    return res.json({ status: "Pending" })
})
.delete((req, res) => {
    //Delete user with id
    return res.json({ status: "Pending" })
})



// when user signup so we get data and add to database, but now we have json only so we added to it 
app.post("/api/users", (req, res) => {
    // Create new user
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    // console.log("Body", body);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        // always pass status code 201 if we create something like user  
        return res.status(201).json({ status: "Success", id: users.length});
    })
})




app.listen(PORT, () => console.log(`Server started at port ${PORT}`))