import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { SubscriptionService, StripeCheckoutResponse } from '../../services/SubscriptionService';
import { useAuth } from '../../providers/AuthProvider';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaCrown, FaArrowLeft } from 'react-icons/fa';

interface ProcessingState {
  loading: boolean;
  success: boolean;
  error: string | null;
  sessionDetails: StripeCheckoutResponse | null;
  updatedUser: any;
}

export function PaymentConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [state, setState] = useState<ProcessingState>({
    loading: true,
    success: false,
    error: null,
    sessionDetails: null,
    updatedUser: null
  });

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'No session ID provided'
      }));
      return;
    }

    if (!auth.isAuthenticated()) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'You must be logged in to confirm payment'
      }));
      return;
    }

    const userId = auth.getUserId();
    if (!userId) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'User ID not found'
      }));
      return;
    }

    const processPayment = async () => {
      try {
        const result = await SubscriptionService.processPaymentConfirmation(
          sessionId,
          parseInt(userId)
        );

        setState({
          loading: false,
          success: true,
          error: null,
          sessionDetails: result.sessionDetails,
          updatedUser: result.updatedUser
        });
      } catch (error) {
        setState({
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          sessionDetails: null,
          updatedUser: null
        });
      }
    };

    processPayment();
  }, [sessionId, auth]);

  const handleBackToDashboard = () => {
    
    navigate('/dashboard');
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };


  if (state.loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <h2 className="card-title justify-center">Processing Payment...</h2>
            <p>Please wait while we confirm your payment and upgrade your account.</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <FaTimesCircle className="text-4xl text-error mx-auto mb-4" />
            <h2 className="card-title justify-center text-error">Payment Failed</h2>
            <p className="text-base-content/70 mb-4">{state.error}</p>
            <div className="card-actions justify-center">
              <button
                className="btn btn-outline btn-error"
                onClick={handleBackToDashboard}
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.success && state.sessionDetails) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <FaCheckCircle className="text-6xl text-success" />
                <FaCrown className="absolute -top-2 -right-2 text-2xl text-warning" />
              </div>
            </div>

            <h2 className="card-title justify-center text-success text-2xl mb-2">
              Payment Successful!
            </h2>

            <p className="text-base-content/70 mb-6">
              Your subscription has been activated successfully.
            </p>

            <div className="bg-base-200 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-3 text-center">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Plan:</span>
                  <span className="font-medium">{state.sessionDetails.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Amount:</span>
                  <span className="font-medium">
                    {formatAmount(state.sessionDetails.amountTotal, state.sessionDetails.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Status:</span>
                  <span className="badge badge-success">{state.sessionDetails.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Customer:</span>
                  <span className="font-medium">{state.sessionDetails.customerEmail}</span>
                </div>
              </div>
            </div>

            <div className="alert alert-success mb-6">
              <FaCheckCircle className="shrink-0" />
              <div>
                <h4 className="font-bold">Account Upgraded!</h4>
                <div className="text-xs">You now have access to premium features.</div>
              </div>
            </div>

            <div className="card-actions justify-center">
              <button
                className="btn btn-primary btn-wide"
                onClick={handleBackToDashboard}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}