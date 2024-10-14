var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Database')
var db = mongoose.connection
db.on('error',()=> console.log("Error in the connecting the Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Generate a token or session ID for authentication
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return res.redirect('home.js')
  });

app.post('/sign_up',(req,res) =>{
    var name = req.body.name
    var age = req.body.age
    var email = req.body.email
    var phone = req.body.phone
    var gender = req.body.gender
    var password = req.body.password

    var data = {
        "name":name,
        "age":age,
        "email":email,
        "phone":phone,
        "gender":gender,
        "password":password
    }

    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record inserted Successfully")
    })

    return res.redirect('signup_successful.html')
})





app.get('/',(req,res) => {
    res.set({
        "Allow-access-Allow-origin": '*'
    })
    return res.redirect('index.html')

}).listen(3000);

console.log("Listening on Port");