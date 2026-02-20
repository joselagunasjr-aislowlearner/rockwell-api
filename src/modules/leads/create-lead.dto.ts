import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { LeadSource, LeadStatus, ServiceInterest } from './lead.entity';

export class CreateLeadDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsEnum(ServiceInterest)
  serviceInterest?: ServiceInterest;

  @IsOptional()
  @IsString()
  notes?: string;
}
