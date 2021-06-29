package fr.univlyon1.m1if.m1if13.usersspringboot;

import fr.univlyon1.m1if.m1if13.usersspringboot.context.ContextBdd;
import fr.univlyon1.m1if.m1if13.usersspringboot.dao.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DaoTest {

    @MockBean
    ContextBdd contextBdd;


    @Autowired
    UserDao userDao;

    @Test
    public void testAddUser(){
        userDao.save(new User("test","test"));
        Assert.assertEquals("testw", contextBdd.getUsers().get(0).getLogin());
    }
}
