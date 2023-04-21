const express = require('express'); 
const app = express();
// const port = 3000
 


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


const mongoose = require('mongoose');

const saucesRoutes = require("./routes/sauces.js")
const userRoutes = require('./routes/user.js');

const path = require('path');

mongoose.connect('mongodb+srv://user_piiquante:piiquante@cluster.xfsifxp.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json()); 

app.get('/api/sauces/like', (req, res) => {
  res.send('Hello LIKE !')
  console.log("ca marchce")
})


app.use("/api/sauces", saucesRoutes)
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname,"images")));


// app.get("api/sauces/like", async (req, res, next) => {
//     try{
//     const users = await User.find({})
//     res.send(users)
//     } catch (error){
//         res.status(500).send(error)
//     }
// })





module.exports = app;
