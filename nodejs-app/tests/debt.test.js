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

// Test `settleUp` and `getDebtByUser`
describe("PUT /api/debt", () => {
  it("should settle up successfully", async () => {
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

    // create a new debt
    const debt = await request(app)
      .post(`/api/debt/`)
      .send({
        channelId: channel.body._id,
        userId: user.body._id,
        targetId: user.body._id,
        balance: 0,
      })
      .set({ Cookie: accessToken });
    expect(debt.statusCode).toBe(200);
    expect(debt.body.settled).toBe(false);

    // get debt by user
    const res1 = await request(app)
      .get(`/api/debt/user/${user.body._id}?channelId=${channel.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.length).toBe(1);
    
		// settle up
		const updatedDebt = await request(app)
			.put(`/api/debt/${debt.body._id}`)
			.send({settled: true})
			.set({ Cookie: accessToken });
		expect(updatedDebt.statusCode).toBe(200);
		expect(updatedDebt.body.settled).toBe(true);

    // delete this user
    const res2 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);
  });
});
