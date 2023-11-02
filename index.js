const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

//store database subscription
const subscriptions = [];

//to comunicate with front-end
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;

const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails("mailto:mtuong669@gmail.com", publicVapidKey.toString(), privateVapidKey.toString());

app.get("/", (req, res) => {
    return res.send("helloword");
});

// Create route for allow client to subscribe to push notification.
app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    res.status(201).json({});

    console.log("Log check subscription: ", subscription);

    //store subscriptions
    subscriptions.push(subscription);
    const payload = JSON.stringify({ title: "Hello World", body: "You have been subricbed" });
    webpush.sendNotification(subscription, payload).catch(console.log);
});

app.post("/send-notification", (req, res) => {
    const payload = JSON.stringify({
        title: "Thanh toán thành công",
        body: "Bạn đã thanh toán thành công cho đơn hàng trên máy POS-25",
    });
    console.log("Log check click");

    res.status(201).json({});

    subscriptions.forEach((item) => {
        webpush.sendNotification(item, payload).catch(console.log);
    });
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
