// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
  // ----------------------------------------------------------
  await books.insertOne({
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    publisher: {
      name: "Gallimard",
      country: "France"
    }
  });

  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  // ----------------------------------------------------------
  await books.insertOne({
    title: "Clean Code",
    author: "Robert C. Martin",
    tags: ["programming", "software", "best-practices"]
  });

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  // ----------------------------------------------------------
  await books.insertMany([
    {
      title: "Les Misérables",
      author: "Victor Hugo",
      publisher: { name: "A. Lacroix, Verboeckhoven & Cie", country: "France" },
      tags: ["classic", "historical"]
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      publisher: { name: "George Allen & Unwin", country: "United Kingdom" }
    },
    {
      title: "Design Patterns",
      author: "Erich Gamma",
      tags: ["software", "architecture", "java"]
    },
    {
      title: "The Stranger",
      author: "Albert Camus",
      publisher: { name: "Gallimard", country: "France" },
      tags: ["philosophical", "classic"]
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen"
    }
  ]);

  // ----------------------------------------------------------
  // TODO 4 - find all documents
  // ----------------------------------------------------------
  const allBooks = await books.find({}).toArray();
  console.log("All books:");
  allBooks.forEach(book => console.log(`- ${book.title}`));

  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  // ----------------------------------------------------------
  const frenchBook = await books.findOne({ "publisher.country": "France" });
  console.log("\nFirst French publisher book:");
  if (frenchBook) {
    console.log(frenchBook.title);
  }

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  // ----------------------------------------------------------
  const frenchBooks = await books.find({ "publisher.country": "France" }).toArray();
  console.log(`\nTotal books published in France: ${frenchBooks.length}`);
  frenchBooks.forEach(book => console.log(`- ${book.title}`));

  // ----------------------------------------------------------
  // TODO 7 - find with $exists
  // ----------------------------------------------------------
  const taggedBooks = await books.find({ tags: { $exists: true } }).toArray();
  console.log("\nBooks with tags:");
  taggedBooks.forEach(book => {
    console.log(`- ${book.title}:`, book.tags);
  });

  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});