package es.angelkrasimirov.timeweaver.utils;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleInvalidJson(HttpMessageNotReadableException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("error", "Invalid Request");

		String detailedMessage = ex.getMessage();
		if (detailedMessage != null) {
			response.put("message", detailedMessage.split(":")[0]);
		} else {
			response.put("message", "Malformed JSON or missing body");
		}

		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
			errors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	// @ExceptionHandler(Exception.class)
	// public ResponseEntity<Map<String, String>> handleGlobalException(Exception
	// ex) {
	// Map<String, String> response = new HashMap<>();
	// response.put("error", "Internal Server Error");
	// response.put("message", ex.getMessage());
	// return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	// }

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) throws Exception {
		if (ex instanceof org.springframework.security.core.AuthenticationException
				|| ex instanceof org.springframework.security.access.AccessDeniedException) {
			throw ex; // let fucking Spring security handle these
		}

		System.err.println("Global exception occurred: " + ex.getClass().getName());
		System.err.println("Exception message: " + ex.getMessage());
		ex.printStackTrace();

		Map<String, String> response = new HashMap<>();
		response.put("error", "Internal Server Error");
		response.put("message", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, String>> handleBadCredentialsException(BadCredentialsException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("error", "Bad Credentials");
		response.put("message", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("error", "Data Integrity Violation");
		response.put("message", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<Map<String, String>> handleNoResourceFoundException(NoResourceFoundException ex) {
		Map<String, String> response = new HashMap<>();
		response.put("error", "Resource Not Found");
		response.put("message", String.format("%s (%s)", ex.getMessage(), ex.getHttpMethod()));
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}
}
