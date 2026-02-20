import { Injectable, Logger } from '@nestjs/common';

interface ZapierLeadPayload {
  contact_name: string;
  email: string;
  phone?: string;
  contact_source: string;
  contact_status: string;
  contact_type: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
}

@Injectable()
export class ZapierWebhookService {
  private readonly logger = new Logger(ZapierWebhookService.name);
  private readonly webhookUrl =
    process.env.ZAPIER_WEBHOOK_URL ||
    'https://hooks.zapier.com/hooks/catch/25952902/ucwbwzr/';

  async pushLead(lead: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    source?: string;
    serviceInterest?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    notes?: string;
  }): Promise<{ success: boolean; zapierRequestId?: string; error?: string }> {
    const payload: ZapierLeadPayload = {
      contact_name: `${lead.firstName} ${lead.lastName}`.trim(),
      email: lead.email,
      phone: lead.phone || '',
      contact_source: 'Contact Form',
      contact_status: 'Lead',
      contact_type: 'Lead',
      street: lead.street || '',
      city: lead.city || '',
      state: lead.state || 'WI',
      zip: lead.zip || '',
      notes: lead.notes || '',
    };

    try {
      this.logger.log(`Pushing lead to Zapier: ${lead.email}`);
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Zapier webhook failed: ${response.status} ${errorText}`);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const result = await response.json();
      this.logger.log(`Lead pushed to Zapier successfully: ${result.id || 'ok'}`);
      return { success: true, zapierRequestId: result.id || result.request_id };
    } catch (error) {
      this.logger.error(`Zapier webhook error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
