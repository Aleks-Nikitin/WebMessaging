import userRouter from "../routes/userRouter.js";
import request from "supertest";
import express from "express";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);

test("user route works", done => {
  request(app)
    .get("/users")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect(res => {
      if (res.body !== "users") throw new Error("unexpected body")
    })
    .end(done);
});

// test("testing route works", done => {
//   request(app)
//     .post("/test")
//     .type("form")
//     .send({ item: "hey" })
//     .then(() => {
//       request(app)
//         .get("/test")
//         .expect({ array: ["hey"] }, done);
//     });
// });
