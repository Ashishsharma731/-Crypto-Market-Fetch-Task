const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const exchangeRoutes = require("./routes/exchangeRoutes");

dotenv.config();
const app = express();

// app.use(cors({
//     origin:["http://localhost:5000"],
//     methods:["GET","POST"]
// }));
app.use(cors());
app.use(express.json());

app.use("/api", exchangeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
