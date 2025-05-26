package es.angelkrasimirov.timeweaver.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import es.angelkrasimirov.timeweaver.dtos.StripeCheckoutResponseDto;
import es.angelkrasimirov.timeweaver.dtos.SubscriptionRoleDto;
import es.angelkrasimirov.timeweaver.models.User;
import es.angelkrasimirov.timeweaver.services.StripeService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class SubscriptionController {

    @Autowired
    private StripeService stripeService;

    @GetMapping("/stripe/token")
    public ResponseEntity<String> createStripeToken() {

        try {
            String token = stripeService.getStripePublicKey();
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stripe/products")
    public ResponseEntity<Map<String, String>> getStripeProducts() {
        Map<String, String> response = new HashMap<>();
        try {
            response.put("intermediatePriceId", stripeService.getIntermediatePriceId());
            response.put("businessPriceId", stripeService.getBusinessPriceId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/users/{userId}/subscription")
    public ResponseEntity<User> assignSubscriptionRole(
            @PathVariable Long userId,
            @Valid @RequestBody SubscriptionRoleDto subscriptionRoleDto) throws NoResourceFoundException {

        User updatedUser = stripeService.assignSubscriptionRole(userId, subscriptionRoleDto.getSubscriptionType());
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/stripe/checkout-session")
    public ResponseEntity<StripeCheckoutResponseDto> getCheckoutSessionDetails(
            @RequestParam String sessionId) {

        try {
            StripeCheckoutResponseDto response = stripeService.getCheckoutSessionDetails(sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}