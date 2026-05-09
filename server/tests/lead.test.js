import request from "supertest";
import app from "../index.js";

describe("POST /api/save-lead", () => {
  it("should save lead successfully", async () => {
    const response = await request(app)
      .post("/api/save-lead")
      .send({
        email: "test@example.com",
        audit: {
          totalSavings: 100,
        },
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBeDefined();
  });
});