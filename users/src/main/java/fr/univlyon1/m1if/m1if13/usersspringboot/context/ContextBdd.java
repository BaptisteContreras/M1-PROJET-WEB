package fr.univlyon1.m1if.m1if13.usersspringboot.context;

import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;

import java.util.ArrayList;
import java.util.List;

public class ContextBdd {
    List<User> users;

    public ContextBdd() {
        users = new ArrayList<>();
        users.add(new User("bapt","toto"));
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
