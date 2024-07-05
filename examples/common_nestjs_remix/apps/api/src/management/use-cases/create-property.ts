import { Controller, Inject, Post } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { type Static, Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { Validate } from "nestjs-typebox";
import { DatabasePg } from "src/common";
import { properties } from "src/storage/schema";

export class CreateProperty {
  name: string;
  description?: string;

  constructor(data: Partial<CreateProperty>) {
    Object.assign(this, data);
  }
}

const requestSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
});
const responseSchema = createSelectSchema(properties);

@Controller("properties")
export class CreatePropertyController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Validate({
    response: responseSchema,
    request: [{ type: "body", schema: requestSchema }],
  })
  async createProperty(data: Static<typeof requestSchema>) {
    const command = new CreateProperty(data);
    return this.commandBus.execute(command);
  }
}

@CommandHandler(CreateProperty)
export class CreatePropertyHandler implements ICommandHandler<CreateProperty> {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async execute(command: CreateProperty) {
    const [property] = await this.db
      .insert(properties)
      .values(command)
      .returning();

    return property;
  }
}
