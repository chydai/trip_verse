import request from "supertest";
import dotenv from "dotenv";
import { jest } from "@jest/globals";
import { connect, close } from "./setup.js";

import app from "../app.js";

dotenv.config();
jest.setTimeout(20000);

// Connecting to the database before all tests.
beforeAll(async () => {
  connect();
});

// Closing database connection after all tests.
afterAll(async () => {
  close();
});

// Test `signup/signin` and `get/update/delete user`.
describe("POST /api/auth/signup /api/auth/signin\n CRUD /api/user/:id", () => {
  it("should register a new user and `get/update/delete user` successfully", async () => {
    // register a new user
    const userSignup = await request(app).post("/api/auth/signup").send({
      name: "user",
      password: "user",
      email: "user@gmail.com",
    });
    expect(userSignup.statusCode).toBe(200);

    // login
    const user = await request(app).post("/api/auth/signin").send({
      email: "user@gmail.com",
      password: "user",
    });
    expect(user.statusCode).toBe(200);

    // get the jwt token
    const cookieString = user.header["set-cookie"][0];
    const accessToken = cookieString.substring(0, cookieString.indexOf(";"));

    // update the phone number
    const updatedUser = await request(app)
      .put(`/api/user/${user.body._id}`)
      .send({ phone: "123-456-7890" })
      .set({ Cookie: accessToken });
    expect(updatedUser.statusCode).toBe(200);

    // get the new phone number
    const res1 = await request(app)
      .get(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.body.phone).toBe("123-456-7890");

    // delete user
    const res2 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);

    // get the user again
    const res3 = await request(app)
      .get(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.body).toBe(null);
  });
});

// Test `subscribe` and `unsubscribe`
describe("PUT /api/user/sub /api/user/unsub", () => {
  it("should subscribe and unsubscribe successfully", async () => {
    // register a new user
    const userSignup = await request(app).post("/api/auth/signup").send({
      name: "user",
      password: "user",
      email: "user@gmail.com",
    });
    expect(userSignup.statusCode).toBe(200);

    // login
    const user = await request(app).post("/api/auth/signin").send({
      email: "user@gmail.com",
      password: "user",
    });
    expect(user.statusCode).toBe(200);

    // get the jwt token
    const cookieString = user.header["set-cookie"][0];
    const accessToken = cookieString.substring(0, cookieString.indexOf(";"));

    // register a new user
    const user2Signup = await request(app).post("/api/auth/signup").send({
      name: "user2",
      password: "user2",
      email: "user2@gmail.com",
    });
    expect(user2Signup.statusCode).toBe(200);

    // login
    const user2 = await request(app).post("/api/auth/signin").send({
      email: "user2@gmail.com",
      password: "user2",
    });
    expect(user2.statusCode).toBe(200);

    // get the jwt token
    const cookieString2 = user2.header["set-cookie"][0];
    const accessToken2 = cookieString2.substring(0, cookieString2.indexOf(";"));

    // subscribe
    const res1 = await request(app)
      .put(`/api/user/sub/${user2.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);

    // get following list
    const res2 = await request(app)
      .get(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.body.following.length).toBeGreaterThan(0);

    // unsubscribe
    const res3 = await request(app)
      .put(`/api/user/unsub/${user2.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);

    // get following list
    const res4 = await request(app)
      .get(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res4.body.following.length).toBe(0);

    // delete user
    const res5 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res5.statusCode).toBe(200);

    // delete user
    const res6 = await request(app)
      .delete(`/api/user/${user2.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(res6.statusCode).toBe(200);
  });
});

// Test `rateUser`.
describe("PUT /api/user/rate", () => {
  it("should rate user successfully", async () => {
    // register a new user
    const userSignup = await request(app).post("/api/auth/signup").send({
      name: "user",
      password: "user",
      email: "user@gmail.com",
    });
    expect(userSignup.statusCode).toBe(200);

    // login
    const user = await request(app).post("/api/auth/signin").send({
      email: "user@gmail.com",
      password: "user",
    });
    expect(user.statusCode).toBe(200);

    // get the jwt token
    const cookieString = user.header["set-cookie"][0];
    const accessToken = cookieString.substring(0, cookieString.indexOf(";"));

    // register a new user
    const user2Signup = await request(app).post("/api/auth/signup").send({
      name: "user2",
      password: "user2",
      email: "user2@gmail.com",
    });
    expect(user2Signup.statusCode).toBe(200);

    // login
    const user2 = await request(app).post("/api/auth/signin").send({
      email: "user2@gmail.com",
      password: "user2",
    });
    expect(user2.statusCode).toBe(200);

    // get the jwt token
    const cookieString2 = user2.header["set-cookie"][0];
    const accessToken2 = cookieString2.substring(0, cookieString2.indexOf(";"));

    // rateUser
    const rating = await request(app)
      .put(`/api/user/rate/${user2Signup.body._id}`)
      .set({ Cookie: accessToken })
      .send({
        rating: 4.8,
        comment: "",
      });
    expect(rating.statusCode).toBe(200);
    expect(rating.body.rating).toBe(4.8);

    // delete user
    const res1 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);

    // delete user
    const res2 = await request(app)
      .delete(`/api/user/${user2.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(res2.statusCode).toBe(200);
  });
});
