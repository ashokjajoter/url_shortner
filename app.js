const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./connection/connect");
const { connect } = require("mongoose");
const { checkForAuthentication, restricTo } = require("./middleware/auth");
//const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const URL = require("./model/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

connectToMongoDB(prcess.env.MONGO_URL)
.then(() => console.log("Mongodb connected!")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

//app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/url", restricTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);
//app.use("/", checkAuth, staticRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
    { 
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    },
    { returnDocument: "after"}
  );

  if(!entry) return res.sendStatus(404);

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));