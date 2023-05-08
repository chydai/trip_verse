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

// Test `create/get/update/delete place` and `getAllPlaces`.
describe("CRUD /api/place", () => {
  it("should create/get/update/delete place successfully", async () => {
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

    // create a new date plan
    const datePlan = await request(app)
      .post(`/api/dateplan/${channel.body._id}`)
      .send({ date: "2023-01-01" })
      .set({ Cookie: accessToken });
    expect(datePlan.statusCode).toBe(200);
    expect(datePlan.body.date).toBe("2023-01-01");

    // create a new place
    const place = await request(app)
      .post(`/api/place/${datePlan.body._id}`)
      .send({ name: "Baltimore" })
      .set({ Cookie: accessToken });
    expect(place.statusCode).toBe(200);

    // update the note
    const updatedPlace = await request(app)
      .put(`/api/place/${place.body._id}`)
      .send({ note: "I want to go to Baltimore" })
      .set({ Cookie: accessToken });
    expect(updatedPlace.statusCode).toBe(200);

    // get the updated place
    const res1 = await request(app)
      .get(`/api/place/${place.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.note).toBe("I want to go to Baltimore");

    // delete this place
    const res2 = await request(app)
      .delete(`/api/place/${place.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);

    // get all places in this places
    const allPlaces = await request(app)
      .get(`/api/place/all/${datePlan.body._id}`)
      .set({ Cookie: accessToken });
    expect(allPlaces.statusCode).toBe(200);
    expect(allPlaces.body.length).toBe(0);

    // delete this user
    const res3 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);
  });
});
