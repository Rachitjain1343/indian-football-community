import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';
import { SUPABASE_ADMIN_CLIENT } from '../../database/supabase.client';

@Injectable()
export class PaymentsService {
  constructor(@Inject(SUPABASE_ADMIN_CLIENT) private db: SupabaseClient) {}
  async create(userId: string, orderId: string) {
    const order = await this.db.from('orders').select('*').eq('id', orderId).eq('user_id', userId).single();
    if (order.error || order.data.payment_status === 'paid') throw new BadRequestException('Order cannot be paid');
    const key = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key || !secret) throw new BadRequestException('Payment gateway is not configured');
    const existing = await this.db.from('payments').select('gateway_order_id,amount').eq('order_id', orderId).eq('status', 'created').maybeSingle();
    if (existing.data) return { keyId: key, order: { id: existing.data.gateway_order_id, amount: Math.round(Number(existing.data.amount) * 100), currency: 'INR' } };
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Math.round(Number(order.data.total_amount) * 100), currency: 'INR', receipt: orderId, notes: { internal_order_id: orderId } }) });
    const gateway: any = await response.json();
    if (!response.ok) throw new BadRequestException(gateway.error?.description || 'Payment gateway error');
    const inserted = await this.db.from('payments').insert({ order_id: orderId, user_id: userId, gateway_order_id: gateway.id, amount: order.data.total_amount, status: 'created' });
    if (inserted.error) throw new BadRequestException(inserted.error.message);
    return { keyId: key, order: gateway };
  }
  async verify(userId: string, body: any) {
    const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`).digest('hex');
    if (!this.secureEqual(expected, body.signature)) throw new BadRequestException('Invalid payment signature');
    return this.markPaid(userId, body.razorpayOrderId, body.razorpayPaymentId, body.signature);
  }
  async webhook(raw: Buffer, signature: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new BadRequestException('Webhook is not configured');
    if (!this.secureEqual(createHmac('sha256', secret).update(raw).digest('hex'), signature)) throw new BadRequestException('Invalid webhook signature');
    const event = JSON.parse(raw.toString('utf8'));
    if (event.event !== 'payment.captured') return { accepted: true, ignored: true };
    const payment = event.payload?.payment?.entity;
    const row = await this.db.from('payments').select('user_id').eq('gateway_order_id', payment?.order_id).maybeSingle();
    if (row.error || !row.data) throw new BadRequestException('Payment record not found');
    await this.markPaid(row.data.user_id, payment.order_id, payment.id, signature);
    return { accepted: true };
  }
  private secureEqual(expected: string, actual = '') { const a = Buffer.from(expected), b = Buffer.from(actual); return a.length === b.length && timingSafeEqual(a, b); }
  private async markPaid(userId: string, orderId: string, paymentId: string, signature: string) { const { data, error } = await this.db.rpc('mark_order_paid', { p_user_id: userId, p_gateway_order_id: orderId, p_gateway_payment_id: paymentId, p_signature: signature }); if (error) throw new BadRequestException(error.message); return data; }
}
