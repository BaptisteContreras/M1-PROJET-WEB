package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.dao.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.request.CreateUserRequest;
import fr.univlyon1.m1if.m1if13.usersspringboot.request.UpdateUserRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.webjars.NotFoundException;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost", "http://localhost:8080", "http://192.168.75.6", "https://192.168.75.6","http://192.168.75.6:8080","https://192.168.75.6:8080"}, exposedHeaders = {"Authentication", "Origin"}, allowedHeaders = "Access-Control-Allow-Origin")
public class UserController {
    private UserDao dao;

    @Autowired
    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    /**
     * Met à jour un user
     * @param login Login du user
     * @param dto
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @Operation(summary = "Update user",
            description = "Update a user",
            tags={"RestUserController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation"),
            @ApiResponse(responseCode = "500", description = "Technical error"),
            @ApiResponse(responseCode = "404", description = "User not found")})
    @PutMapping(value = "/user/{login}")
    public ResponseEntity<Void> update(@PathVariable("login") String login, @Valid @RequestBody UpdateUserRequest dto) {
        Optional optional = dao.get(login);
        if (optional.isPresent()){
            try {
                dao.update((User)optional.get(), new String[]{
                        dto.getLogin(),dto.getPassword()
                });
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Crée un utilisateur
     * @param user L'objet user à créer
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @Operation(summary = "Create user",
            description = "Crate a user",
            tags={"RestUserController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Technical error")})
    @PostMapping(value = "/users")
    public ResponseEntity<Void> create(@Valid @RequestBody CreateUserRequest user) {
        if(dao.get(user.getLogin()).isPresent()){
            return ResponseEntity.status(400).build();
        }else{
            try {
                dao.save(new User(user.getLogin(),user.getPassword()));
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        }
    }

    /**
     * Récupère tous les utilisateurs
     * @return Une liste d'utilisateurs
     */
    @Operation(summary = "Get users",
            description = "Get all users",
            tags={"RestUserController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")})
    @GetMapping(value = "/users", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_HTML_VALUE})
    public ModelAndView getUsers(){
        ModelAndView modelAndView = new ModelAndView("users");
        modelAndView.addObject("users", dao.getAll());
        return modelAndView;
    }

    /**
     * Delete un user
     * @param login Login du user
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @Operation(summary = "Delete user",
            description = "Delete a user",
            tags={"RestUserController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation"),
            @ApiResponse(responseCode = "404", description = "User not found")})
    @DeleteMapping(value = "/user/{login}")
    public ResponseEntity<Void> delete(@PathVariable("login") String login){
        Optional optional = dao.get(login);
        if (optional.isPresent()){
            dao.delete((User) optional.get());
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupère un utilisateur via son login
     * @param login login du user
     * @return un utilisateur
     */
    @Operation(summary = "Get user",
            description = "Get a user",
            tags={"RestUserController"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "404", description = "User not found")})
    @GetMapping(value = "/user/{login}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_HTML_VALUE})
    public ModelAndView get(@PathVariable("login") String login){
        Optional optional = dao.get(login);
        ModelAndView modelAndView;
        if (optional.isPresent()){
            modelAndView = new ModelAndView("user");
            modelAndView.setStatus(HttpStatus.OK);
            modelAndView.addObject("user", optional.get());
        }else{
            modelAndView = new ModelAndView("error");
            modelAndView.addObject("error",new NotFoundException("Not found"));
            modelAndView.addObject("status", "404");
            modelAndView.addObject("message", "Utilisateur non trouvé.");
            modelAndView.setStatus(HttpStatus.NOT_FOUND);
        }
        return modelAndView;
    }
}
