import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import mongoose = require("mongoose");
import config from "config";
import multer from "multer";
import path from "path";
import 'dotenv/config';

const router = express();

router.set('views', path.join(__dirname, 'views'));
router.set("view engine", "ejs");
const storage = multer.diskStorage({
  destination: 'temp',
  filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload: any = multer({ 
  storage: storage,
  limits: {
      fileSize: 200 * 1024 * 1024
  },
  dest: "temp" });
router.use(upload.any());
router.use(express.static('./public'));
//router.use(express.static(path.resolve('./public/')));
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const PORT = process.env.PORT || 3000;
const server = http.createServer(router);

mongoose
  .connect(`${config.get("MONGO_CRED.MONGO_PATH")}/${process.env.DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    server.listen(PORT);
    console.log(`Server is running http://localhost:${PORT}...`);
  })
  .catch((err) => {
    console.log(err);
  });
