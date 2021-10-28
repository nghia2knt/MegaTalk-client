const express = require("express");

const app = express();

app.use(express.json({ extended: false }));
app.use(express.static("./src"));
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.get("/", (req, res) => {
  return res.render("trangchu");
});
app.get("/nguoidung", (req, res) => {
  return res.render("nguoidung");
});
app.get("/dangnhap/", (req, res) => {
  return res.render("dangnhap");
});
app.get("/dangky/", (req, res) => {
  return res.render("dangky");
});

app.get("/quenmatkhau/", (req, res) => {
  return res.render("quenmatkhau");
});

app.get("/khoiphucmatkhau/", (req, res) => {
  return res.render("khoiphucmatkhau");
});

app.get("/kichhoat/", (req, res) => {
  return res.render("kichhoat");
});

app.get("/chat", (req, res) => {
  return res.render("chat");
});
app.get("/test", (req, res) => {
  return res.render("chattest");
});

app.listen(3000, () => {
  console.log("SV is running!!!");
});
