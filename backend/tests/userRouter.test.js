import userRouter from "../routes/userRouter.js";
import request from "supertest";
import express from "express";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);

// test("user route works", done => {
//   request(app)
//     .get("/users")
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .expect(res => {
//       if (res.body !== "users") throw new Error("unexpected body")
//     })
//     .end(done);
// });
// test("user can be created",done=>{
//   request(app)
//   .post("/users")
//   .type("form")
//   .send({
//     firstname:"bob",
//     lastname:"brown",
//     password:"Gunter7_",
//     confpassword:"Gunter7_",
//     email:"bob@gmail.com"
//   })
//   .expect({msg:"user created"})
//   .end(done)

// })
