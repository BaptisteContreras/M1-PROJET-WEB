package fr.univlyon1.m1if.m1if13.usersspringboot.request;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

public class UpdateUserRequest {
    @Valid
    @NotEmpty(message = "Ce champs est obligatoire.")
    private String login;

    @Valid
    @NotEmpty(message = "Ce champs est obligatoire.")
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
