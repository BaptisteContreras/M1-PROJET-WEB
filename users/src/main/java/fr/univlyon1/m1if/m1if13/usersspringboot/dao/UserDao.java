package fr.univlyon1.m1if.m1if13.usersspringboot.dao;

import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.context.ContextBdd;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

public class UserDao implements Dao<User> {
    private ContextBdd contextBdd;

    @Autowired
    public void setContextBdd(ContextBdd contextBdd) {
        this.contextBdd = contextBdd;
    }

    public UserDao() {
    }

    @Override
    public Optional<User> get(String login) {
        for (User x : contextBdd.getUsers())
            if (x.getLogin().equals(login))
                return Optional.of(x);
        return Optional.empty();
    }

    @Override
    public Set<String> getAll() {
        Set<String> set = new HashSet<>();
        for (User x : contextBdd.getUsers())
            set.add(x.getLogin());
        return set;
    }

    @Override
    public void save(User user) {
        contextBdd.getUsers().add(user);
    }

    @Override
    public void update(User user, String[] params) {
        user.setLogin(Objects.requireNonNull(
                params[0], "Login cannot be null"));
        user.setPassword(Objects.requireNonNull(
                params[1], "Password cannot be null"));
    }

    @Override
    public void delete(User user) {
        contextBdd.getUsers().remove(user);
    }
}
