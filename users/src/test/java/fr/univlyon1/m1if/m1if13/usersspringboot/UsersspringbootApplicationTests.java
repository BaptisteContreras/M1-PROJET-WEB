package fr.univlyon1.m1if.m1if13.usersspringboot;

import fr.univlyon1.m1if.m1if13.usersspringboot.context.ContextBdd;
import fr.univlyon1.m1if.m1if13.usersspringboot.controller.UserController;
import fr.univlyon1.m1if.m1if13.usersspringboot.dao.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.request.CreateUserRequest;
import fr.univlyon1.m1if.m1if13.usersspringboot.request.UpdateUserRequest;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.servlet.ModelAndView;

import java.util.Optional;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest
class UsersspringbootApplicationTests {

    @Autowired
    ContextBdd contextBdd;


    @Autowired
    UserDao userDao;

    @Autowired
    UserController userController;

    @Test
    public void testAddUser() {
        userDao.save(new User("test", "test"));
        Assert.assertEquals("test", contextBdd.getUsers().get(1).getLogin());

    }

    @Test
    public void testGetUser() {
        getNewContext();
        User test = new User("test", "test");
        userDao.save(test);

        Optional<User> test1 = userDao.get("test");
        Assert.assertTrue(test1.isPresent());

    }

    @Test
    public void testGetAllUsers() {
        getNewContext();
        User test = new User("test", "test");
        userDao.save(test);

        Set<String> test1 = userDao.getAll();
        Assert.assertEquals(2, test1.size());

    }

    @Test
    public void testUpdateUSer() {
        getNewContext();
        userDao.update(contextBdd.getUsers().get(0), new String[]{"test", "test"});
        Assert.assertEquals("test", contextBdd.getUsers().get(0).getLogin());

    }

    @Test
    public void testGetUser_should_return_ko() {
        getNewContext();
        ModelAndView bapt = userController.get("testcs");
        Assert.assertEquals(HttpStatus.NOT_FOUND, bapt.getStatus());
    }

    @Test
    public void testGetUser_should_return_ok() {
        getNewContext();
        ModelAndView bapt = userController.get("bapt");
        Assert.assertEquals(HttpStatus.OK, bapt.getStatus());
    }

    @Test
    public void testGetUser_null_should_return_not_found() {
        getNewContext();
        ModelAndView bapt = userController.get(null);
        Assert.assertEquals(HttpStatus.NOT_FOUND, bapt.getStatus());
    }

    @Test
    public void testCreateRequest_missingLogin_should_return_ko() {
        getNewContext();
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setLogin(null);
        createUserRequest.setPassword("password");
        ResponseEntity<Void> bapt = userController.create(createUserRequest);
        Assert.assertEquals(HttpStatus.NO_CONTENT, bapt.getStatusCode());
    }

    @Test
    public void testCreateRequest_missingPassword_should_return_ko() {
        getNewContext();
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setLogin("test");
        createUserRequest.setPassword(null);
        ResponseEntity<Void> bapt = userController.create(createUserRequest);
        Assert.assertEquals(HttpStatus.NO_CONTENT, bapt.getStatusCode());
    }

    @Test
    public void testCreateRequest_existing_user_should_return_ko() {
        getNewContext();
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setLogin("bapt");
        createUserRequest.setPassword("dkslkdjs");
        ResponseEntity<Void> bapt = userController.create(createUserRequest);
        Assert.assertEquals(HttpStatus.BAD_REQUEST, bapt.getStatusCode());
    }

    @Test
    public void testCreateRequest_goodParam_should_return_ok() {
        getNewContext();
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setLogin("test");
        createUserRequest.setPassword("jflhfsdjlhf");
        ResponseEntity<Void> bapt = userController.create(createUserRequest);
        Assert.assertEquals(HttpStatus.NO_CONTENT, bapt.getStatusCode());
    }

	@Test
	public void testUpdateRequest_goodParam_should_return_ok() {
		getNewContext();
		UpdateUserRequest updateUserRequest = new UpdateUserRequest();
		updateUserRequest.setLogin("test");
		updateUserRequest.setPassword("jflhfsdjlhf");
		ResponseEntity<Void> bapt = userController.update("bapt", updateUserRequest);
		Assert.assertEquals(HttpStatus.NO_CONTENT, bapt.getStatusCode());
	}
    private void getNewContext() {
        contextBdd = new ContextBdd();
        userDao.setContextBdd(contextBdd);
    }

    @Test
    void contextLoads() {
    }


}
