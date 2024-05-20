import express from "express";
import NodeCache from "node-cache";
import fetch from "node-fetch";

const app = express();

const cache = new NodeCache();

const cacheData = (key, value, ttl) => {
  console.log(`Saving in cache user: ${key}`)
  cache.set(key, value, ttl);
};

const getCachedData = (key) => {
  console.log(`Searching in cache user: ${key}`)
  return cache.get(key);
};

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const cachedData = getCachedData(id);

  if (cachedData) {
    console.log(`Return saved user: ${id}`)
    return res.json(cachedData);
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data = await response.json();
    cacheData(id, data, 3600); //Save cache for an hour
    res.send(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
  
});

app.get("*", (_, res) =>{
  res.status(404).send()
})

app.listen(3000, () => {
  console.log("App running on port 3000");
});
