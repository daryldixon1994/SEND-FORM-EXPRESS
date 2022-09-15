const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

/// view engine setup
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("view engine", "pug");

//body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//static folder
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("contact", { layout: false });
});
app.post("/send", (req, res) => {
    // console.log("req body", req.body);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
          <li>Name: ${req.body.name}</li>
          <li>Company: ${req.body.company}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
      `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", //smtp server hotmail
        port: 587,
        secure: false,
        auth: {
            user: "splusdeux.services@outlook.com",
            pass: "splusdeuxhighservices@@147123",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"GMC Contact" <splusdeux.services@outlook.com>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "WORKSHOP EXPRESS", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.render("contact", {
                layout: false,
                error,
            });
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("contact", { msg: "Email has been sent" });
    });
});
app.get("/about", (req, res) => {
    res.render("about", {
        layout: false,
        text: "THIS IS THE NEW ABOUT PAGE, WELCOME",
    });
});
app.get("/pug", (req, res) => {
    res.render("home");
});
app.listen(5000, () => {
    console.log("server is running");
});
