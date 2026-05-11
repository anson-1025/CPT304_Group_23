const request = require("supertest");
const app = require("../src/app");

describe("Route Tests", () => {
    test("GET / should return 200", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
    });

    test("GET /signup should return 200", async () => {
        const res = await request(app).get("/signup");
        expect(res.statusCode).toBe(200);
    });

    test("GET /dashboard should return 200", async () => {
        const res = await request(app).get("/dashboard");
        expect(res.statusCode).toBe(200);
    });

    test("GET invalid route should return 404", async () => {
        const res = await request(app).get("/invalidroute");
        expect(res.statusCode).toBe(404);
    });

    test("Security headers should be set", async () => {
       const res = await request(app).get("/");
       expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });

});