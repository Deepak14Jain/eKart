package com.group4.eKart.exception;


import com.group4.eKart.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EmptyResourceException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmptyResourceException(EmptyResourceException e) {
        ErrorResponseDTO error = new ErrorResponseDTO(e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
