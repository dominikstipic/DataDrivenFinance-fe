import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "resources")));

app.get("/", function(req, res){
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))