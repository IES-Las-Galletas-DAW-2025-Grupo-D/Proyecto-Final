package es.angelkrasimirov.timeweaver.dtos;

import java.math.BigDecimal;

public class StripeCheckoutResponseDto {
    private String sessionId;
    private String paymentStatus;
    private String subscriptionId;
    private String customerId;
    private String customerEmail;
    private BigDecimal amountTotal;
    private String currency;
    private String priceId;
    private String productName;
    private boolean isConfirmed;

    public StripeCheckoutResponseDto() {
    }

    public StripeCheckoutResponseDto(String sessionId, String paymentStatus, boolean isConfirmed) {
        this.sessionId = sessionId;
        this.paymentStatus = paymentStatus;
        this.isConfirmed = isConfirmed;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public BigDecimal getAmountTotal() {
        return amountTotal;
    }

    public void setAmountTotal(BigDecimal amountTotal) {
        this.amountTotal = amountTotal;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPriceId() {
        return priceId;
    }

    public void setPriceId(String priceId) {
        this.priceId = priceId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public boolean isConfirmed() {
        return isConfirmed;
    }

    public void setConfirmed(boolean confirmed) {
        isConfirmed = confirmed;
    }
}