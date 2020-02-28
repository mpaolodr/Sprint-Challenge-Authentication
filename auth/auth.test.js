const server = require("../api/server.js");
const request = require("supertest")(server);
const db = require("../database/dbConfig.js");

describe("test environment check", () => {
  it("runs on testing environment", () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });

  it("sanity", () => {
    expect(true).toBe(true);
  });
});

describe("AUTHROUTER ENDPOINTS", () => {
  afterAll(() => {
    return db("users").cleanUp();
  });

  describe("register", () => {
    beforeEach(() => {
      return db("users").truncate();
    });

    it("returns 201 Created", () => {
      return request
        .post("/api/auth/register")
        .send({ username: "TEST", password: "TEST" })
        .then(res => {
          expect(res.status).toBe(201);
        });
    });

    it("returns 400 without required fields", () => {
      return request
        .post("/api/auth/register")
        .send({ username: "TEST" })
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe("Please provide required fields!");
        });
    });
  });

  describe("login", () => {
    beforeEach(done => {
      return request
        .post("/api/auth/register")
        .send({ username: "TEST", password: "TEST" })
        .end(err => {
          if (err) done(err);
          done();
        });
    });

    afterEach(() => {
      return db("users").truncate();
    });

    it("returns 200", () => {
      return request
        .post("/api/auth/login")
        .send({ username: "TEST", password: "TEST" })
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it("returns token and id", () => {
      return request
        .post("/api/auth/login")
        .send({ username: "TEST", password: "TEST" })
        .then(res => {
          expect(res.body).toEqual({ token: res.body.token, id: res.body.id });
        });
    });

    it("returns 400 when username or password is not provided", () => {
      return request
        .post("/api/auth/login")
        .send({ username: "TEST" })
        .then(res => {
          expect(res.status).toBe(400);
        });
    });

    it("returns 404 when username is not registered", () => {
      return request
        .post("/api/auth/login")
        .send({ username: "TESTING", password: "TEST" })
        .then(res => {
          expect(res.status).toBe(404);
        });
    });

    it("returns 404 when password is wrong", () => {
      return request
        .post("/api/auth/login")
        .send({ username: "TEST", password: "TESTing" })
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });
});
