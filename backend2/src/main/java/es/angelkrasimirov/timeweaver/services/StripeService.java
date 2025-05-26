package es.angelkrasimirov.timeweaver.services;

import java.math.BigDecimal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.LineItem;
import com.stripe.model.LineItemCollection;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;

import es.angelkrasimirov.timeweaver.dtos.StripeCheckoutResponseDto;
import es.angelkrasimirov.timeweaver.models.Role;
import es.angelkrasimirov.timeweaver.models.User;

@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.intermediate.price.id}")
    private String intermediatePriceId;

    @Value("${stripe.business.price.id}")
    private String businessPriceId;

    @Value("${stripe.public.key}")
    private String stripePublicKey;

    @Autowired
    private UserService userService;

    public StripeCheckoutResponseDto getCheckoutSessionDetails(String sessionId) throws StripeException {
        Stripe.apiKey = stripePublicKey;

        try {
            Session session = Session.retrieve(sessionId);
            System.out.println("Retrieved session: " + session);
            StripeCheckoutResponseDto response = new StripeCheckoutResponseDto();
            response.setSessionId(sessionId);
            response.setPaymentStatus(session.getPaymentStatus());
            response.setSubscriptionId(session.getSubscription());
            response.setCustomerId(session.getCustomer());
            response.setCustomerEmail(session.getCustomerEmail());
            response.setCurrency(session.getCurrency());
            response.setConfirmed("paid".equals(session.getPaymentStatus()));

            if (session.getAmountTotal() != null) {
                response.setAmountTotal(new BigDecimal(session.getAmountTotal()).divide(new BigDecimal(100)));
            }

            // Get line items to extract price and product information
            Map<String, Object> lineItemParams = Map.of("limit", 10);
            LineItemCollection lineItems = session.listLineItems(lineItemParams);

            if (!lineItems.getData().isEmpty()) {
                LineItem firstItem = lineItems.getData().get(0);
                Price price = firstItem.getPrice();

                if (price != null) {
                    response.setPriceId(price.getId());

                    if (price.getProductObject() != null) {
                        response.setProductName(price.getProductObject().getName());
                    } else if (price.getProduct() != null) {
                        // If product is just an ID, fetch the product details
                        Product product = Product.retrieve(price.getProduct());
                        response.setProductName(product.getName());
                    }
                }
            }

            logger.info("Retrieved checkout session: {} with status: {}", sessionId, session.getPaymentStatus());

            return response;

        } catch (StripeException e) {
            logger.error("Error retrieving Stripe checkout session {}: {}", sessionId, e.getMessage());
            throw e;
        }
    }

    public User assignSubscriptionRole(Long userId, String subscriptionType) throws NoResourceFoundException {
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new NoResourceFoundException(HttpMethod.GET, "User not found with id: " + userId);
        }

        Role subscriptionRole = getSubscriptionRole(subscriptionType);

        // Remove existing subscription roles
        user.removeRole(Role.ROLE_INTERMEDIATE);
        user.removeRole(Role.ROLE_BUSINESS);

        // Add new subscription role
        user.addRole(subscriptionRole);

        User updatedUser = userService.saveUser(user);
        logger.info("Assigned {} role to user {}", subscriptionRole, userId);

        return updatedUser;
    }

    private Role getSubscriptionRole(String subscriptionType) {
        return switch (subscriptionType.toLowerCase()) {
            case "intermediate" -> Role.ROLE_INTERMEDIATE;
            case "business" -> Role.ROLE_BUSINESS;
            default -> throw new IllegalArgumentException("Invalid subscription type: " + subscriptionType);
        };
    }

    public String getStripePublicKey() {
        return stripePublicKey;
    }

    public String getIntermediatePriceId() {
        return intermediatePriceId;
    }

    public String getBusinessPriceId() {
        return businessPriceId;
    }
}
