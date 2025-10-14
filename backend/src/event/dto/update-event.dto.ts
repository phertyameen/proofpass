import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({
    description: 'Whether event is active',
    example: true,
  })
  isActive?: boolean;
}