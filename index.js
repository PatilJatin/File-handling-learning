require("dotenv").config();
const express = require("express");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.set("view engine", "ejs");
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/myform", (req, res) => {
  console.log(req.body);
  //for react, angular
  // res.send(req.body);

  //for template engine
  res.send(req.query);
});
app.post("/myPost", async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  let result;
  let imageArray = [];

  // case - multiple images

  if (req.files) {
    for (let index = 0; index < req.files.sampleFile.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.sampleFile[index].tempFilePath,
        {
          folder: "users",
        }
      );

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  // ### use case for single image
  // let file = req.files.sampleFile;
  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  console.log(result);

  let details = {
    firstname: req.body.firstname,
    lastname: req.body.lastName,
    result,
    imageArray,
  };
  console.log(details);

  res.send(details);
});

app.get("/mygetform", (req, res) => {
  res.render("getForm.ejs");
});

app.get("/myPostform", (req, res) => {
  res.render("postForm.ejs");
});

app.listen(5000, () => {
  console.log("server is running at 5000...");
});
