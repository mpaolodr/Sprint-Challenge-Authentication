const server = require("../api/server.js");
const request = require("supertest")(server);
const db = require("../database/dbConfig.js");

describe("jokes router tests", () => {
  beforeEach(() => {
    return request
      .post("/api/auth/register")
      .send({ username: "DEMO", password: "DEMO" })
      .then(res => {
        return request
          .post("/api/auth/login")
          .send({ username: "DEMO", password: "DEMO" })
          .then(res => {
            token = res.body.token;
          });
      });
  });

  afterEach(() => {
    return db("users").truncate();
  });

  it("returns an array", () => {
    return request
      .get("/api/jokes")
      .set("authorization", token)
      .then(res => {
        expect(res.body).not.toHaveLength(0);
      });
  });

  it("returns 200 code", () => {
    return request
      .get("/api/jokes")
      .set("authorization", token)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});
