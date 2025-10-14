import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  //   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieve all blockchain transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [Transaction],
  })
  async findAll(): Promise<Transaction[]> {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  //   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieve a specific transaction',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return await this.transactionsService.findOne(id);
  }

  @Get('hash/:hash')
  @ApiOperation({
    summary: 'Get transaction by hash',
    description: 'Retrieve transaction by blockchain hash',
  })
  @ApiParam({ name: 'hash', description: 'Transaction hash' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findByHash(@Param('hash') hash: string): Promise<Transaction> {
    const tx = await this.transactionsService.findByHash(hash);
  if (!tx) {
    throw new NotFoundException('Transaction not found');
  }
  return tx;
  }

  @Get('event/:eventId')
  //   @UseGuards(JwtAuthGuard)
  //   @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get transactions for event',
    description: 'Retrieve all transactions related to an event',
  })
  @ApiParam({ name: 'eventId', description: 'Event ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [Transaction],
  })
  async findByEvent(@Param('eventId') eventId: string): Promise<Transaction[]> {
    return await this.transactionsService.findByEvent(eventId);
  }
}
