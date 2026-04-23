const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let products = [];

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.get("/products", (req, res) => {
  res.render("index", { products });
});

app.get("/products/add", (req, res) => {
  res.render("add");
});

app.post("/products/add", (req, res) => {
  const { name, price, stock, description } = req.body;

  if (name && price && stock) {
    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parseFloat(price).toFixed(2),
      stock: parseInt(stock, 10),
      description: description.trim(),
    };
    products.push(newProduct);
  }

  res.redirect("/products");
});

app.get("/products/edit/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.render("edit", { product });
});

app.post("/products/edit/:id", (req, res) => {
  const productId = req.params.id;
  const { name, price, stock, description } = req.body;

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex > -1) {
    products[productIndex] = {
      ...products[productIndex],
      name: name.trim(),
      price: parseFloat(price).toFixed(2),
      stock: parseInt(stock, 10),
      description: description.trim(),
    };
  }

  res.redirect("/products");
});

app.post("/products/delete/:id", (req, res) => {
  const productId = req.params.id;
  products = products.filter((p) => p.id !== productId);

  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
