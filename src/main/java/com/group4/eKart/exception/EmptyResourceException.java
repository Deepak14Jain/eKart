package com.group4.eKart.exception;

public class EmptyResourceException extends RuntimeException {
    public EmptyResourceException(){
        super("Access to empty DataBase");
    }
}