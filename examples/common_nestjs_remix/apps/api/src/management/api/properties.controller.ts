import { Controller, Delete, Post } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import { propertySchema } from "../schemas/property";
import { createPropertySchema } from "../schemas/create-property";
import { Static } from "@sinclair/typebox";
import { PropertiesService } from "../properties.service";
import {
  BaseResponse,
  UUIDSchema,
  baseResponse,
  nullResponse,
} from "src/common";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Validate({
    response: baseResponse(propertySchema),
    request: [{ type: "body", schema: createPropertySchema }],
  })
  async createProperty(
    data: Static<typeof createPropertySchema>,
  ): Promise<BaseResponse<Static<typeof propertySchema>>> {
    const property = await this.propertiesService.createProperty(data);

    return new BaseResponse(property);
  }

  @Delete(":id")
  @Validate({
    response: nullResponse(),
    request: [{ name: "id", type: "param", schema: UUIDSchema }],
  })
  async deleteProperty(id: string): Promise<null> {
    await this.propertiesService.deleteProperty(id);
    return null;
  }
}
