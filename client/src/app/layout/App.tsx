import React, { useEffect, useState } from "react";
import { Product } from "../models/Product";

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(response => response.json())
      .then(data => setProducts(data))
  }, [])
  return (
    <div>
      <h1>Ski Store</h1>
      <ul>
        {products.map((item) => (
          <li key={item.id}>{item.name} - {item.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
