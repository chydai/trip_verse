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

// Test `create/get/delete post`, `getOwnedPosts` and `getRandomPosts`
describe("CRD /api/post\n GET /api/post/owned /api/post/random", () => {
  it("should create/get/delete post successfully", async () => {
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

    // create a new post
    const post = await request(app)
      .post("/api/post")
      .send({
        title: "post",
        content: "content",
      })
      .set({ Cookie: accessToken });
    expect(post.statusCode).toBe(200);

    // get post by id
    const res1 = await request(app)
      .get(`/api/post/${post.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.title).toBe("post");

    // get random posts
    const randomGroups = await request(app)
      .get(`/api/post/random`)
      .set({ Cookie: accessToken });
    expect(randomGroups.statusCode).toBe(200);
    expect(randomGroups.body.length).toBeGreaterThan(0);

    // delete this post
    const res2 = await request(app)
      .delete(`/api/post/${post.body._id}`)
      .set({ Cookie: accessToken });
    expect(res2.statusCode).toBe(200);

    // get all owned post
    const ownedGroups = await request(app)
      .get(`/api/post/owned`)
      .set({ Cookie: accessToken });
    expect(ownedGroups.statusCode).toBe(200);
    expect(ownedGroups.body.length).toBe(0);

    // delete this user
    const res3 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res3.statusCode).toBe(200);
  });
});

// Test `like/dislike post`
describe("PUT /api/post/like /api/post/dislike", () => {
  it("should like/dislike post successfully", async () => {
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

    // create a new post
    const post = await request(app)
      .post("/api/post")
      .send({
        title: "post",
        content: "content",
      })
      .set({ Cookie: accessToken });
    expect(post.statusCode).toBe(200);

    // like post
    const likedPost = await request(app)
      .put(`/api/post/like/${post.body._id}`)
      .set({ Cookie: accessToken });
    expect(likedPost.statusCode).toBe(200);
    expect(likedPost.body.likes.length).toBeGreaterThan(0);

		// dislike post
    const dislikedPost = await request(app)
      .put(`/api/post/dislike/${post.body._id}`)
      .set({ Cookie: accessToken });
    expect(dislikedPost.statusCode).toBe(200);
    expect(dislikedPost.body.likes.length).toBe(0);

    // delete user
    const res1 = await request(app)
      .delete(`/api/user/${user.body._id}`)
      .set({ Cookie: accessToken });
    expect(res1.statusCode).toBe(200);
  });
});
