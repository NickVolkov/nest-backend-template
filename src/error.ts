import { ApiProperty } from '@nestjs/swagger';

export function ErrorDto<Name extends string>(definition: {
  name: Name;
  status: number;
  message: string;
}) {
  class DomainError extends Error {
    @ApiProperty({ enum: [definition.name] })
    readonly name: Name = definition.name;

    @ApiProperty()
    readonly status = definition.status;

    constructor() {
      super(definition.message);
    }
  }
  return DomainError;
}
