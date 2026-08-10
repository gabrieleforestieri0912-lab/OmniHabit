import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findUserById, updateUserById, updateUserBySubscriptionId } from '@/lib/db/repos';

export const runtime = 'nodejs';

function getStripe(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY non configurata. Stripe è disattivato.');
  }
  return new Stripe(stripeKey);
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') as string;
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!) as Stripe.Event;
  } catch (err) {
    const e = err as Error;
    console.error('Webhook signature verification failed:', e.message);
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const user = await findUserById(userId || '');
        if (user) {
          await updateUserById(user.id, {
            is_premium: true,
            subscription_status: 'active',
            stripe_plan_name: session.metadata?.planName || 'Premium',
            stripe_customer_id: String(session.customer || ''),
            stripe_subscription_id: String(session.subscription || ''),
            subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          console.log(`Premium attivato per ${userId}`);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const obj = event.data.object as { subscription?: string | null };
        await updateUserBySubscriptionId(String(obj.subscription || ''), { subscription_status: 'past_due' });
        console.log('Pagamento fallito per un abbonamento');
        break;
      }
      case 'customer.subscription.deleted': {
        const obj = event.data.object as Stripe.Subscription;
        await updateUserBySubscriptionId(String(obj.id || ''), { is_premium: false, subscription_status: 'cancelled' });
        console.log('Abbonamento annullato');
        break;
      }
      case 'checkout.session.expired':
        console.log('Checkout session expired');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
