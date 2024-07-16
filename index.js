require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const base = require('./routes')

// Database Details
// const DB_USER = process.env['DB_USER'];
// const DB_PWD = process.env['DB_PWD'];
// const DB_URL = process.env['DB_URL'];
// const DB_NAME = "task-jeff";
// const DB_COLLECTION_NAME = "players";
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME;
const mongoDbHost = process.env.DB_URL
const mongoDB = process.env.DB_NAME

// Debugging: Log environment variables
console.log(`MONGO_DB_HOST: ${mongoDbHost}`);
console.log(`MONGO_DB_NAME: ${mongoDB}`);
console.log(`DB_COLLECTION_NAME: ${DB_COLLECTION_NAME}`);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb://${mongoDbHost}:27017/${mongoDB}`
// const uri = `mongodb+srv://${DB_USER}:${DB_PWD}@${DB_URL}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://"+DB_USER+":"+DB_PWD+"@"+DB_URL+"/?retryWrites=true&w=majority";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

let db;

app.use('/', require('./routes/teamResult'))
app.use('/add-team', base.addTeam);
app.use('/process-result', processResult);
app.use('/team-result', teamResult);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    db = client.db(DB_NAME);
    
    console.log("You successfully connected to MongoDB!");
    
  } finally {
  }
}


// Sample create document
async function sampleCreate() {
  const demo_doc = { 
    "demo": "doc demo",
    "hello": "world"
  };
  const demo_create = await db.collection(DB_COLLECTION_NAME).insertOne(demo_doc);
  
  console.log("Added!")
  console.log(demo_create.insertedId);
}


// Endpoints

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.get('/demo', async (req, res) => {
  await sampleCreate();
  res.send({status: 1, message: "demo"});
});

//

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

run();