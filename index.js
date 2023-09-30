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

const uri = 'mongodb+srv://subhanishaikshaik70:subhani123@customerinfo.eejhgke.mongodb.net/?retryWrites=true&w=majority';
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

app.get('/', async (req, res) => {
    try {
        let users = await User.find();
        res.json({
            users: users
        })
    } catch (e) {
        console.log(e, 'error while fetching userdata');
        res.json({ e: 'error while fetching userData' });
    }
})

app.post('/customer/register', async (req, res) => {
    let { email, username } = req.body;
    try {
        let userExist = await User.findOne({ $or: [{ email }, { username }] });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Generate a new ObjectId
        const createNewAccountNO = mongoose.Types.ObjectId();
        // Extract the first 10 characters of the ObjectId
        const newAccountNo = createNewAccountNO.str.substring(0, 10);

        const data = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            country: req.body.country,
            state: req.body.state,
            dob: req.body.dob,
            address: req.body.address,
            contactNo: req.body.contactNo,
            accountType: req.body.accountType,
            branchName: req.body.branchName,
            initialDepositAmount: req.body.initialDepositAmount,
            identificationProofType: req.body.identificationProofType,
            identificationDocumentNo: req.body.identificationDocumentNo,
            accountNo: newAccountNo,
            accountBalance: req.body.initialDepositAmount,
        });
        res.json({
            status: 'user created successfully!'
        })
    } catch (e) {
        res.json({
            status: 'error',
            error: 'Exception while creating User!'
        })
    }
});

app.post('/customer/login', async (req, res) => {
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
            status: 'User Details are not found!',
            user: false
        })
    }
});

app.listen(port, () => {
    console.log(`Application running1 on port ${port}`);
});