const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require("./models/user.model")

app.use(cors());
app.use(express.json());
const port = 5657;



// mongoose.connect('mongodb://localhost:27017/mern-app').then((res) => {
//     console.log('mongodb connected')
// }).catch(e => {
//     console.log('mongodb failed to connect');
// });

const uri='mongodb+srv://subhanishaikshaik70:subhani123@customerinfo.eejhgke.mongodb.net/?retryWrites=true&w=majority';
// Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Check for a successful connection
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
  });

app.get('/',async(req,res)=>{
    res.json({
        status: 'user created successfully'
    })
})

app.post('/customer/register', async (req, res) => {
    console.log(req.body, 'got it');

    try {
        let data = await User.create({
            name: req.body.name,
            company: req.body.company,
            username: req.body.username,
            password:req.body.password
        });
        console.log(data, 'data');
        res.json({
            status: 'user created successfully'
        })

    } catch (e) {
        console.log(e, 'got excepton');
        res.json({
            status: 'error',
            error: 'user already existed'
        })
    }
});

app.post('/customer/login', async (req, res) => {
    console.log(req.body,'got it');
    let user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (user) {
        res.send({
            status: user,
            user: true
        })
    } else {
        res.send({
            status: 'invalid user!try again',
            user: false
        })
    }
});

app.listen(port, () => {
    console.log(`Application running1 on port ${port}`);
});