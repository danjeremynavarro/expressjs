const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  indexRouter = require("./routes/index"),
  usersRouter = require("./routes/users"),
  apiRouter = require("./routes/api"),
  app = express(),
  nunjucks = require("nunjucks"),
  sessionProcessor = require("./routes/session"),
  fs = require("fs"),
  EmailUtils = require("./private/email");

//read configs
const passwordFile = fs.readFileSync("../passwords.json");

//set globals
global.serverRoot = __dirname;
const mailSettings = JSON.parse(passwordFile);
global.emailTransport = new EmailUtils(mailSettings);
app.set("env", "development");

// server settings
const port = 3000;

// view engine setup
let loc = path.resolve(__dirname, "./views");
app.set("views", loc);
nunjucks.configure("views", {
  "autoescape": true,
  "cache": false,
  "express": app
});
app.set("view engine", "njk");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("*", sessionProcessor);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
app.use(express.static(path.join(serverRoot, "public")));
// test
/*
app.use("/test", function(req,res){
	res.send(loc);
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {"error": err.stack});
  //res.send(err.stack);
});

app.listen(port, () => console.log("Started server ..."));

module.exports = app;

