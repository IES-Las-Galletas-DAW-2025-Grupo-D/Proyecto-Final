package es.angelkrasimirov.timeweaver.dtos;

import jakarta.validation.constraints.NotNull;

public class SubscriptionRoleDto {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Subscription type is required")
    private String subscriptionType;

    private String stripeCustomerId;
    private String stripeSubscriptionId;

    public SubscriptionRoleDto() {
    }

    public SubscriptionRoleDto(Long userId, String subscriptionType) {
        this.userId = userId;
        this.subscriptionType = subscriptionType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }

    public String getStripeSubscriptionId() {
        return stripeSubscriptionId;
    }

    public void setStripeSubscriptionId(String stripeSubscriptionId) {
        this.stripeSubscriptionId = stripeSubscriptionId;
    }
}