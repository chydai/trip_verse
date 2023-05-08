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

// Test `create/get/update/delete bill` and `getAllBills`.
describe("CRUD /api/bill", () => {
  it("should create/get/update/delete bill successfully", async () => {
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

    // create a new date plan
    const datePlan = await request(app)
      .post(`/api/dateplan/${channel.body._id}`)
      .send({ date: "2023-01-01" })
      .set({ Cookie: accessToken });
    expect(datePlan.statusCode).toBe(200);
    expect(datePlan.body.date).toBe("2023-01-01");

    // create a new bill
    const bill = await request(app)
      .post(`/api/bill/${datePlan.body._id}`)
      .send({
        description: "sushi",
        payer: user.body._id,
        amount: 30,
        debt: [{ user: user2.body._id, balance: 25.2 }],
      })
      .set({ Cookie: accessToken });
    expect(bill.statusCode).toBe(200);
    expect(bill.body.description).toBe("sushi");

    // update the bill
    const updatedBill = await request(app)
      .put(`/api/bill/${bill.body._id}`)
      .send({
        description: "burger",
        payer: user.body._id,
        debt: [{ user: user2.body._id, balance: 36.3 }],
      })
      .set({ Cookie: accessToken });
    expect(updatedBill.statusCode).toBe(200);
    expect(updatedBill.body.description).toBe("burger");

    // get the udpated bill
    const res1 = await request(app)
      .get(`/api/bill/${bill.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.debt[0].balance).toBe(36.3);

		// delete this bill
		const res2 = await request(app)
			.delete(`/api/bill/${bill.body._id}`)
			.set({ Cookie: accessToken });
		expect(res2.statusCode).toBe(200);

		// get all bills in this date plan
		const allBillsInThisDatePlan = await request(app)
			.get(`/api/bill/all?datePlanId=${datePlan.body._id}`)
			.set({ Cookie: accessToken });
		expect(allBillsInThisDatePlan.statusCode).toBe(200);
		expect(allBillsInThisDatePlan.body.length).toBe(0);

		// get all bills in this channel
		const allBillsInThisChannel = await request(app)
		.get(`/api/bill/all?channelId=${channel.body._id}`)
		.set({ Cookie: accessToken });
		expect(allBillsInThisChannel.statusCode).toBe(200);
		expect(allBillsInThisChannel.body.length).toBe(0);

    // delete this user
    const res3 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);
  });
});
