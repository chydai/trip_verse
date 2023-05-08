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

// Test `getRandomGroups`.
describe("GET /api/group/random", () => {
  it("should get some random groups", async () => {
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

    // create a new group
    const group = await request(app)
      .post(`/api/group`)
      .send({
        name: "group",
        origin: "Baltimore",
        destination: "New York",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
      })
      .set({ Cookie: accessToken });
    expect(group.statusCode).toBe(200);
    expect(group.body.name).toBe("group");

    // get random groups
    const res1 = await request(app).get("/api/group/random");
    expect(res1.body.length).toBeGreaterThan(0);

    // delete this user
    const res2 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);
  });
});

// Test `create/get/update/delete group` and `getOwnedGroups`.
describe("CRUD /api/group\n GET /api/group/owned", () => {
  it("should create/get/update/delete group successfully", async () => {
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

    // create a new group
    const group = await request(app)
      .post(`/api/group`)
      .send({
        name: "group",
        origin: "Baltimore",
        destination: "New York",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
      })
      .set({ Cookie: accessToken });
    expect(group.statusCode).toBe(200);
    expect(group.body.name).toBe("group");

    // update the description
    const updatedGroup = await request(app)
      .put(`/api/group/${group.body._id}`)
      .send({ description: "This is a test group" })
      .set({ Cookie: accessToken });
    expect(updatedGroup.statusCode).toBe(200);

    // get the updated group
    const res1 = await request(app)
      .get(`/api/group/${group.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.body.description).toBe("This is a test group");

    // delete this group
    const res2 = await request(app)
      .delete(`/api/group/${group.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);

    // get all owned group
    const ownedGroups = await request(app)
      .get(`/api/group/owned`)
      .set({ Cookie: accessToken });
    expect(ownedGroups.body.length).toBe(0);

    // delete this user
    const res3 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);
  });
});

// Test `joinGroup`, `getJoinedGroups`, `quitGroup`, and `transferGroup`.
describe("GET /api/group/joined\n PUT /api/group/join /api/group/quit /api/group/transfer", () => {
  it("should join/transfer/quit group successfully", async () => {
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

    // create a new group
    const group = await request(app)
      .post(`/api/group`)
      .send({
        name: "group",
        origin: "Baltimore",
        destination: "New York",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
      })
      .set({ Cookie: accessToken });
    expect(group.statusCode).toBe(200);
    expect(group.body.name).toBe("group");

    // join the new group
    const joinedGroup = await request(app)
      .put(`/api/group/join/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedGroup.statusCode).toBe(200);
    expect(joinedGroup.body.members).toContain(user2.body._id);

    // transfer this group
    const transferredGroup = await request(app)
      .put(`/api/group/transfer/${group.body._id}?targetId=${user2.body._id}`)
      .set({ Cookie: accessToken });
    expect(transferredGroup.statusCode).toBe(200);
    expect(transferredGroup.body.userId).toEqual(user2.body._id);

    // quit this group
    const quittedGroup = await request(app)
      .put(`/api/group/quit/${group.body._id}`)
      .set({ Cookie: accessToken });
    expect(quittedGroup.statusCode).toBe(200);
    expect(quittedGroup.body.members).not.toContain(user.body._id);

    // get joined groups
    const joinedGroups = await request(app)
      .get(`/api/group/joined/`)
      .set({ Cookie: accessToken });
    expect(joinedGroups.statusCode).toBe(200);
    expect(joinedGroups.body.length).toBe(0);

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

// Test `like/dislike group` and `removeMember`.
describe("PUT /api/group/like /api/group/dislike /api/group/remove", () => {
  it("should like/dislike group and remove member successfully", async () => {
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

    // create a new group
    const group = await request(app)
      .post(`/api/group`)
      .send({
        name: "group",
        origin: "Baltimore",
        destination: "New York",
        startDate: "2020-01-01",
        endDate: "2022-01-01",
      })
      .set({ Cookie: accessToken });
    expect(group.statusCode).toBe(200);
    expect(group.body.name).toBe("group");

    // join the new group
    const joinedGroup = await request(app)
      .put(`/api/group/join/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedGroup.statusCode).toBe(200);
    expect(joinedGroup.body.members).toContain(user2.body._id);

    // like group
    const likedGroup = await request(app)
      .put(`/api/group/like/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(likedGroup.statusCode).toBe(200);
    expect(likedGroup.body.likes.length).toBeGreaterThan(0);

    // dislike group
    const dislikedGroup = await request(app)
      .put(`/api/group/dislike/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(dislikedGroup.statusCode).toBe(200);
    expect(dislikedGroup.body.likes.length).toBe(0);

    // remove member
    const updatedGroup = await request(app)
      .put(`/api/group/remove/${group.body._id}?targetId=${user2.body._id}`)
      .set({ Cookie: accessToken });
    expect(updatedGroup.statusCode).toBe(200);
    expect(updatedGroup.body.members).not.toContain(user2.body._id);

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
