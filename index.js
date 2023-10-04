const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require("./models/user.model");
const { json } = require('body-parser');
const { ObjectId } = mongoose.Types;

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

        function generateNumericUniqueID() {
            const timestamp = new Date().getTime(); // Get the current timestamp
            const randomNum = Math.floor(Math.random() * 10000); // Generate a random number (you can adjust the range)
            return parseInt(`${timestamp}${randomNum}`, 10); // Combine timestamp and random number
        }

        // Example usage
        const uniqueID = new String(generateNumericUniqueID()).substring(0, 8);
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
            accountNo: uniqueID,
            accountBalance: req.body.initialDepositAmount,
            loanData: req.body.loanData
        });
        res.json({
            status: 'user created successfully!'
        })
    } catch (e) {
        console.log(e, 'got it');
        res.json({
            status: 'error',
            error: 'Exception while creating User!'
        })
    }
});

app.post('/customer/update', async (req, res) => {
    let { accountNo, username } = req.body;
    try {
        let userExist = await User.findOne({ $or: [{ accountNo }, { username }] });
        const filter = { accountNo: req.body.accountNo };
        const updateUserDataObj = {
            name: req.body.name,
            country: req.body.country,
            state: req.body.state,
            dob: req.body.dob,
            address: req.body.address,
            contactNo: req.body.contactNo,
            accountType: req.body.accountType,
            branchName: req.body.branchName,
            identificationProofType: req.body.identificationProofType,
            identificationDocumentNo: req.body.identificationDocumentNo,
        }
        if (userExist) {
            async function updateUserData() {
                try {
                    const updatedUser = await User.findOneAndUpdate(
                        filter,
                        updateUserDataObj,
                        { new: true }
                    );
                    if (!updatedUser) {
                        return { status: "usern not found" };
                    }
                    res.send(updatedUser)

                } catch (error) {
                    console.error('Error updating user details:', error);
                }
            }
            updateUserData();
        }
    }catch(e){
        console.log('error while updat the reacord');
        res.send({status:'user updation is failed!'})
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

app.post('/customer/applyLoan', async (req, res) => {
    const filter = { accountNo: req.body.accountNo };
    const updateLoan = { $push: { loanData: req.body.loanData } }
    async function updateUserData() {
        try {
            const updatedUser = await User.findOneAndUpdate(
                filter,
                updateLoan,
                { new: true }
            );
            if (!updatedUser) {
                return { status: "usern not found" };
            }
            res.send(updatedUser)

        } catch (error) {
            console.error('Error updating user details:', error);
        }
    }
    updateUserData();

});

app.post('/customer/depositwithdraw', async (req, res) => {
    const filter = { accountNo: req.body.accountNo };
    const updatedData = { $set: { accountBalance: req.body.accountBalance } };

    async function updateUserData() {
        try {
            const updatedUser = await User.findOneAndUpdate(
                filter,
                updatedData,
                { new: true }
            );
            if (!updatedUser) {
                return { status: "user User accountBalance updated" };
            }
            res.send(updatedUser)
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    }
    updateUserData();

});

app.listen(port, () => {
    console.log(`Application running1 on port ${port}`);
});