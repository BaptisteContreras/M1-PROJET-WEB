package fr.univlyon1.m1if.m1if13.usersspringboot.config;

import fr.univlyon1.m1if.m1if13.usersspringboot.context.ContextBdd;
import fr.univlyon1.m1if.m1if13.usersspringboot.dao.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public UserDao userDao(){
        return new UserDao();
    }
    @Bean
    public ContextBdd contextBdd(){
        return new ContextBdd();
    }
}
