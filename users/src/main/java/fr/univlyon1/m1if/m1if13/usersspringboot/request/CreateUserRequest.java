package fr.univlyon1.m1if.m1if13.usersspringboot.request;


import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class CreateUserRequest {

    @Valid
    @NotEmpty(message = "Ce champs est obligatoire.")
    @NotNull(message = "Ce champs est ogligatoire")
    private String login;

    @Valid
    @NotEmpty(message = "Ce champs est obligatoire.")
    @NotNull(message = "Ce champs est ogligatoire")
    private String password;


    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
