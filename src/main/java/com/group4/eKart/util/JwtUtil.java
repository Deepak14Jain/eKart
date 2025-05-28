package com.group4.eKart.util;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {
    private static final byte[] SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();

    public static byte[] getSecretKey() {
        return SECRET_KEY;
    }
}
