const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
router.use(express.urlencoded())
router.use(express.json())
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "navbar.html"));
});
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "signup.html"));
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "login.html"));
});
router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "about.html"));
});
router.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "contact.html"));
});
router.get("/trialform", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "trialform.html"));
});
router.get("/features", (req, res) => {
  if (req.session && req.session.IsLoggedIn) {
    res.sendFile(path.join(__dirname, "../view", "features.html"));
  } else {
    res.redirect("/login");
  }
});
router.get("/discoverc", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "discoverc.html"));
});
router.get("/discoverh", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "discoverh.html"));
});
router.get("/discoveri", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "discoveri.html"));
});
router.get("/navbar", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "navbar.html"));
});

router.get("/standard", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "standard.html"));
});
router.get("/classic", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "classic.html"));
});
router.get("/hunter", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "hunter.html"));
});
router.get("/super", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "super.html"));
});
router.get("/himalayan", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "himalayan.html"));
});
router.get("/meteor", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "meteor.html"));
});
router.get("/gt", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "gt.html"));
});
router.get("/interceptor", (req, res) => {
  res.sendFile(path.join(__dirname, "../view", "interceptor.html"));
});

router.post("/signup", (req, res) => {
    try {
        const filePath = path.join(__dirname, "../data.json");

        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) return res.status(500).json({ message: "Error reading file" });

            let users = [];
            if (data) {
                try {
                    users = JSON.parse(data);
                    if (!Array.isArray(users)) users = [];
                } catch (parseError) {
                    users = [];
                }
            }

            const user = users.find(user => user.name === req.body.name);
            if (user) {
                return res.json({ success: false, message: "User already exists" });
            }

            const newUser = {
                name: req.body.name,
                username: req.body.username,
                phone: req.body.phone,
                password: req.body.password
            };

            users.push(newUser);

            fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
                if (err) return res.status(500).json({ message: "Error saving data" });

                res.json({ success: true, redirectUrl: "/login" });
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;


router.post("/login", (req, res) => {
  try {
    fs.readFile(path.join(__dirname, "../data.json"), "utf-8", (err, data) => {
      if (err) {
        console.log("File read error:", err);
        return res.json({ message: "server error" });
      }
      data = JSON.parse(data);
      let user = data.find((ele) => ele.name === req.body.name);
      if (user) {
        if (user.password === req.body.password) {
          req.session.IsLoggedIn = true;
          res.redirect("/features");
        } else {
          res.send("invalid password");
        }
      } else {
         res.redirect("/signup");
       
      }
    });
  } catch (error) {
    console.log("Catch error:", error);
    res.json({ message: "server error" });
  }
});
router.post("/contact", (req, res) => {
  console.log("req.body:", req.body);

  const { name, email, message } = req.body;

  try {
    fs.readFile(path.join(__dirname, "../contact.json"), "utf-8", (err, fileData) => {
      if (err) {
        return res.status(500).send("<h2>Server Error: Cannot read data</h2>");
      }

      let data = JSON.parse(fileData || "[]");

      let existing = data.find(
        (ele) => ele.email === email && ele.message === message
      );

      if (existing) {
        return res.send(`<div style="font-family: Arial; text-align:center; padding:20px; background:#f8d7da; color:#721c24;">
            <h1>⚠ Message Already Submitted</h1>
            <p>We have already received your message:</p>
            <p><strong>${message}</strong></p>
            <a href="/" style="display:inline-block; margin-top:20px; padding:10px 15px; background:#721c24; color:#fff; text-decoration:none; border-radius:5px;">Go Back</a>
          </div> `);
      }

      data.push(req.body);

      fs.writeFile(path.join(__dirname, "../contact.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
          return res.status(500).send("<h2>Server Error: Cannot save data</h2>");
        }

        res.send(` <div style="font-family: Arial; text-align:center; padding:30px; background:#f8f9fa;">
            <h1 style="color:#28a745;">✅ Thank You, ${name}!</h1>
            <p>Your message has been received.</p>
            <p>We will contact you at <strong style="color:#007bff;">${email}</strong> soon.</p>
            <hr>
            <p><strong>Your Message:</strong> ${message}</p>
            <a href="/" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">Go Back</a>
          </div>`);
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error occurred");
  }
});



// router.post('/contact',(req,res)=>{
//     const {name,email,message}=req.body;
//     console.log("contact",{name,email,message});
//     res.send("messege sent")
// })


router.post("/trial", (req, res) => {
  try {
    const {bikeModel,firstName,lastName,email,phone } = req.body;

    console.log("ride data", req.body);

    const filePath = path.join(__dirname, "../trial.json");

    fs.readFile(filePath, "utf-8", (err, fileData) => {
      if (err) {
        console.error("Read error:", err);
        return res.status(500).send("Error reading file");
      }
      let data = [];
      if (fileData) {
        try {
          data = JSON.parse(fileData);
        } catch (parseErr) {
          console.error("Parse error:", parseErr);
          return res.status(500).send("Error parsing file");
        }
      }
      data.push(req.body);
      fs.writeFile("trial.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error("error found :", err);
          return res.status(500).send("Error saving data");
        }
        res.send(`<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f8f9fa;">
            <h1 style="color: #333;">Thank you, ${firstName} ${lastName}!</h1>
            <p style="font-size: 18px; color: #555; margin: 10px 0;">
              Your test drive request for <strong style="color: #007bff;">${bikeModel || "Royal Enfield"}</strong> 
              has been received.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
              We will contact you soon at: 
              <span style="font-weight: bold; color: #28a745;">${phone}</span> or mail you at 
              <span style="font-weight: bold; color: #dc3545;">${email}</span>
            </p>
            <hr style="margin: 20px auto; width: 80%; border: 0; border-top: 1px solid #ccc;">
            <p style="font-size: 14px; color: #777;">Thank you for choosing us for your ride experience!</p>
          </div>`);
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
