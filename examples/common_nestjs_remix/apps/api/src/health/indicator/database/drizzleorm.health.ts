import { Inject, Injectable } from "@nestjs/common";
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from "@nestjs/terminus";
import { sql } from "drizzle-orm";
import { DatabasePg } from "src/common";

@Injectable()
export class DrizzleOrmHealthIndicator extends HealthIndicator {
  constructor(@Inject("DB") private readonly db: DatabasePg) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.db.execute(sql`SELECT 1`);

      return this.getStatus(key, true);
    } catch (error) {
      const result = this.getStatus(key, false);
      throw new HealthCheckError("Database check failed", result);
    }
  }
}
