const express = require("express");
const app = express();
const server = require("http").createServer(app);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/build/index.html", {
    etag: false,
    lastModified: false,
  });
});
app.use(
  "/",
  express.static(__dirname + "/build", { etag: false, lastModified: false })
);
app.get("/*", function (req, res) {
  res.sendFile(
    __dirname + "/build" + req._parsedOriginalUrl.pathname + ".html",
    {
      etag: false,
      lastModified: false,
    }
  );
});
server.listen(8080, function () {
  console.log("listening on port 8080");
});
