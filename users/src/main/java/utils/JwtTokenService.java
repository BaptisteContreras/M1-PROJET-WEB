package utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JwtTokenService {
    public static String getToken(String login, String origin){
        try {
            Algorithm algorithm = Algorithm.HMAC256("bapt&jb_secret");
            String token = JWT.create()
                    .withClaim("login", login)
                    .withClaim("origin", origin)
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception){
            return null;
        }
    }

    public static String decodeToken(String token, String origin){
        try {
            DecodedJWT jwtToken = JWT.decode(token);
            if(jwtToken.getClaim("origin").asString().equals(origin)){
                return jwtToken.getClaim("login").asString();
            }
            return "";
        } catch (JWTDecodeException exception){
            return "";
        }
    }
}
