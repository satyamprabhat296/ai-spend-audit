import request from "supertest";
import app from "../index.js";

describe("POST /api/summary", () => {
  it("should return AI summary", async () => {
    const response = await request(app)
      .post("/api/summary")
      .send({
        audit: {
          totalSavings: 120,
        },
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.summary).toBeDefined();
  });
});