package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.dao.UserDao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utils.JwtTokenService;

import javax.naming.AuthenticationException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost", "http://localhost:8080", "http://192.168.75.6","http://192.168.75.6:8080","https://192.168.75.6:8080", "https://192.168.75.6"}, exposedHeaders = {"Authentication", "Origin"})
public class OperationController {
    private UserDao dao;

    /**
     * Procédure de login "simple" d'un utilisateur
     * @param login Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
     */
    @Operation(summary = "Login",
            description = "Procédure de login \"simple\" d'un utilisateur",
            tags={"RestOperationController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation"),
            @ApiResponse(responseCode = "401", description = "Exception on login"),
            @ApiResponse(responseCode = "404", description = "Login not found")})
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestParam("login") String login, @RequestParam("password") String password, @RequestHeader("Origin") String origin) {
        Optional optional = dao.get(login);
        if (optional.isPresent()){
            try {
                ((User)optional.get()).authenticate(password);
                return ResponseEntity.status(204).header("Authentication", JwtTokenService.getToken(((User) optional.get()).getLogin(), origin)).header("Origin", origin).build();
            } catch (AuthenticationException e) {
                return ResponseEntity.status(401).build();
            }
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Réalise la déconnexion
     * @param token Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @Operation(summary = "Logout",
            description = "Réalise la déconnexion",
            tags={"RestOperationController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "401", description = "Need to be authenticated"),
            @ApiResponse(responseCode = "404", description = "Login not found")})
    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout  (@RequestHeader("Authentication") String token, @RequestHeader("Origin") String origin) {
        String login = JwtTokenService.decodeToken(token, origin);
        Optional optional = dao.get(login);
        if (optional.isPresent()){
            User user = (User)optional.get();
            if(user.getLogin().equals(login)) {
                if(user.isConnected()){
                    user.disconnect();
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(401).build();
                }
            }else{
                return ResponseEntity.status(404).build();
            }
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Méthode destinée au serveur Node pour valider l'authentification d'un utilisateur.
     * @param token Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @Operation(summary = "Authenticate",
            description = "Méthode pour vérifier l'authentifaction d'un utilisateur",
            tags={"RestOperationController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Connected"),
            @ApiResponse(responseCode = "401", description = "Not connected"),
            @ApiResponse(responseCode = "400", description = "Bad request")})
    @GetMapping("/authenticate")
    public ResponseEntity<Void> authenticate(@RequestHeader("Authentication") String token, @RequestParam("Origin") String origin) {
        if(token.isEmpty()){
            return ResponseEntity.status(400).build();
        }
        String login = JwtTokenService.decodeToken(token, origin);
        Optional optional = dao.get(login);
        if (optional.isPresent()){
            if(((User)optional.get()).isConnected()){
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(401).build();
            }
        }else{
            return ResponseEntity.status(400).build();
        }
    }

    @Autowired
    public void setDao(UserDao userDao) {
        this.dao = userDao;
    }
}
