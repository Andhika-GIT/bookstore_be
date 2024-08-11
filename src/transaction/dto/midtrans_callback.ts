import { IsOptional, IsString, IsArray } from 'class-validator';

export class MidtransCallbackDto {
  @IsOptional()
  @IsArray()
  va_numbers?: { va_number: string; bank: string }[];

  @IsString()
  transaction_time: string;

  @IsString()
  transaction_status: string;

  @IsString()
  transaction_id: string;

  @IsString()
  status_message: string;

  @IsString()
  status_code: string;

  @IsString()
  signature_key: string;

  @IsString()
  payment_type: string;

  @IsOptional()
  payment_amounts?: { paid_at: string; amount: string }[];

  @IsString()
  order_id: string;

  @IsString()
  merchant_id: string;

  @IsString()
  gross_amount: string;

  @IsString()
  fraud_status: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  settlement_time?: string;

  @IsOptional()
  @IsString()
  expiry_time?: string;
}
