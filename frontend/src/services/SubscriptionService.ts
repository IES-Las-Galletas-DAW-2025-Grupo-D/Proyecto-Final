import { toApiUrl, fetchWithAuth } from "../utils/api";
import { environment } from "../environments/environment";
import Stripe from 'stripe';

export interface StripeCheckoutResponse {
  sessionId: string;
  paymentStatus: string;
  subscriptionId: string;
  customerId: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  priceId: string;
  productName: string;
  confirmed: boolean;
}

export interface SubscriptionRoleDto {
  userId: number;
  subscriptionType: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export class SubscriptionService {
  private static stripeTokenCache: string | null = null;
  /**
   * Get checkout session details from Stripe
   */
  static async getCheckoutSessionDetails(sessionId: string): Promise<StripeCheckoutResponse> {
    try {
      const response = await fetchWithAuth(toApiUrl(`/stripe/checkout-session?sessionId=${sessionId}`));
      console.log('Response from Stripe API:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching checkout session details:', error);
      throw error;
    }
  }

  /**
   * Assign subscription role to user after successful payment
   */
  static async assignSubscriptionRole(userId: number, subscriptionData: SubscriptionRoleDto): Promise<string> {
    try {
      const response = await fetchWithAuth(toApiUrl(`/users/${userId}/subscription`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign subscription role: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error assigning subscription role:', error);
      throw error;
    }
  }

  /**
   * Process payment confirmation - get session details and assign role
   */
  static async processPaymentConfirmation(sessionId: string, userId: number): Promise<{
    sessionDetails: StripeCheckoutResponse;
    updatedUser: string;
  }> {
    try {
      console.log('Processing payment confirmation for session ID:', sessionId, 'and user ID:', userId);
      // First, get the checkout session details
      const sessionDetails = await this.getCheckoutSessionDetails(sessionId);
      console.log('Session details:', sessionDetails);
      if (!sessionDetails.confirmed) {
        throw new Error('Payment not confirmed');
      }

      // Map price ID to subscription type
      const subscriptionType = this.getSubscriptionTypeFromPriceId(sessionDetails.priceId);

      // Prepare subscription data
      const subscriptionData: SubscriptionRoleDto = {
        userId,
        subscriptionType,
        stripeCustomerId: sessionDetails.customerId,
        stripeSubscriptionId: sessionDetails.subscriptionId
      };

      // Assign the subscription role
      const updatedUser = await this.assignSubscriptionRole(userId, subscriptionData);

      return {
        sessionDetails,
        updatedUser
      };
    } catch (error) {
      console.error('Error processing payment confirmation:', error);
      throw error;
    }
  }
  /**
   * Get Stripe token from backend
   */
  static async getStripeToken(): Promise<string> {
    if (this.stripeTokenCache) {
      return this.stripeTokenCache;
    }

    try {
      const response = await fetch(toApiUrl('/stripe/token'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const token = await response.text();
      this.stripeTokenCache = token; // Cache for future use
      return token;
    } catch (error) {
      console.error('Error fetching Stripe token:', error);
      throw error;
    }
  }
  /**
   * Helper method to determine subscription type from price ID
   * You'll need to configure these price IDs to match your Stripe setup
   */
  private static getSubscriptionTypeFromPriceId(priceId: string): string {
    if (priceId === environment.INTERMEDIATE_PRICE_ID) {
      return 'intermediate';
    } else if (priceId === environment.BUSINESS_PRICE_ID) {
      return 'business';
    } else {
      throw new Error(`Unknown price ID: ${priceId}`);
    }
  }
  /**
   * Create checkout session directly using Stripe API
   */
  static async createCheckoutSession(priceId: string): Promise<{ url: string }> {
    try {
      const token = await this.getStripeToken();
      const stripe = new Stripe(this.stripeTokenCache || token);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `http://localhost:3000/payment/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancel`,
      });

      if (!session.url) {
        throw new Error('Failed to create checkout session URL');
      }

      return { url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}