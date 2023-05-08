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

// Test `create/get/update/delete channel` and `getOwnedChannels`.
describe("CRUD /api/channel\n GET /api/channel/owned/:groupId", () => {
  it("should create/get/update/delete channel successfully", async () => {
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

    // create a new channel
    const channel = await request(app)
      .post(`/api/channel/${group.body._id}`)
      .send({ name: "channel" })
      .set({ Cookie: accessToken });
    expect(channel.statusCode).toBe(200);
    expect(channel.body.name).toBe("channel");

    // update the name
    const updatedChannel = await request(app)
      .put(`/api/channel/${channel.body._id}`)
      .send({ name: "updated_channel" })
      .set({ Cookie: accessToken });
    expect(updatedChannel.statusCode).toBe(200);

    // get the updated channel
    const res1 = await request(app)
      .get(`/api/channel/${channel.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.body.name).toBe("updated_channel");

    // delete this channel
    const res2 = await request(app)
      .delete(`/api/channel/${channel.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);

    // get all owned channel
    const ownedChannels = await request(app)
      .get(`/api/channel/owned/${group.body._id}`)
      .set({ Cookie: accessToken });
    expect(ownedChannels.body.length).toBe(0);

    // delete this user
    const res3 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);
  });
});

// Test `join/transfer/quit channel` and `getJoinedChannels`.
describe("GET /api/channel/joined/:groupId\n PUT /api/group/join /api/group/quit /api/group/transfer", () => {
  it("should join/transfer/quit channel successfully", async () => {
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

    // create a new channel
    const channel = await request(app)
      .post(`/api/channel/${group.body._id}`)
      .send({ name: "channel" })
      .set({ Cookie: accessToken });
    expect(channel.statusCode).toBe(200);
    expect(channel.body.name).toBe("channel");

    // join the group first
    const joinedGroup = await request(app)
      .put(`/api/group/join/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedGroup.statusCode).toBe(200);
    expect(joinedGroup.body.members).toContain(user2.body._id);

    // join the new channel
    const joinedChannel = await request(app)
      .put(`/api/channel/join/${channel.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedChannel.statusCode).toBe(200);
    expect(joinedChannel.body.members).toContain(user2.body._id);

    // transfer this channel
    const transferredChannel = await request(app)
      .put(
        `/api/channel/transfer/${channel.body._id}?targetId=${user2.body._id}`
      )
      .set({ Cookie: accessToken });
    expect(transferredChannel.statusCode).toBe(200);
    expect(transferredChannel.body.userId).toEqual(user2.body._id);

    // quit this channel
    const quittedChannel = await request(app)
      .put(`/api/channel/quit/${channel.body._id}`)
      .set({ Cookie: accessToken });
    expect(quittedChannel.statusCode).toBe(200);
    expect(quittedChannel.body.members).not.toContain(user.body._id);

    // get joined channels
    const joinedChannels = await request(app)
      .get(`/api/channel/joined/${group.body._id}`)
      .set({ Cookie: accessToken });
    expect(joinedChannels.statusCode).toBe(200);
    expect(joinedChannels.body.length).toBe(0);

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

// Test `removeMember`.
describe("PUT /api/channel/remove", () => {
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

    // create a new channel
    const channel = await request(app)
      .post(`/api/channel/${group.body._id}`)
      .send({ name: "channel" })
      .set({ Cookie: accessToken });
    expect(channel.statusCode).toBe(200);
    expect(channel.body.name).toBe("channel");

    // join the group first
    const joinedGroup = await request(app)
      .put(`/api/group/join/${group.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedGroup.statusCode).toBe(200);
    expect(joinedGroup.body.members).toContain(user2.body._id);

    // join the new channel
    const joinedChannel = await request(app)
      .put(`/api/channel/join/${channel.body._id}`)
      .set({ Cookie: accessToken2 });
    expect(joinedChannel.statusCode).toBe(200);
    expect(joinedChannel.body.members).toContain(user2.body._id);

    // remove member
    const updatedChannel = await request(app)
      .put(`/api/channel/remove/${channel.body._id}?targetId=${user2.body._id}`)
      .set({ Cookie: accessToken });
    expect(updatedChannel.statusCode).toBe(200);
    expect(updatedChannel.body.members).not.toContain(user2.body._id);

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
