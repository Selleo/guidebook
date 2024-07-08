import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { properties } from "src/storage/schema";

@Injectable()
export class PropertiesService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async createProperty(data: { name: string; description?: string }) {
    const [property] = await this.db
      .insert(properties)
      .values({
        name: data.name,
        description: data.description,
      })
      .returning();

    return property;
  }

  async deleteProperty(id: string): Promise<void> {
    const [deleted] = await this.db
      .delete(properties)
      .where(eq(properties.id, id));

    if (!deleted) {
      throw new NotFoundException();
    }
  }
}
