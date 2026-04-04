const {test,expect,request} =   require('@playwright/test');

const loginPayload = new URLSearchParams({
  email: 'test1234@yahoo.com',
  password: 'password'
});
const email = "test1234@yahoo.com";
const password = "password";

test('Demo Network Intercept', async ({ page }) => {

  // Login via the UI and check that you have Notes getting displayed first in the UI
  
   await page.goto('https://practice.expandtesting.com/notes/app');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button",{name:"Login"}).click();
  const text = await page.getByTestId("progress-info");
 await expect(text).toHaveText("You have 0/1 notes completed in the all categories");

  // 1. LOGIN via the API to get the token
      const newContext = await request.newContext();
        // const loginResponse =  await newContext.post("https://practice.expandtesting.com/notes/api/users/login",{data:loginPayload});
     
         const loginResponse = await newContext.post('https://practice.expandtesting.com/notes/api/users/login',
            {
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
               },
             data: loginPayload.toString()
           });
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        console.log(loginResponseJson);
        const userId = loginResponseJson.data.id;
        const token = loginResponseJson.data.token;
        console.log(token);
        console.log(userId);

  // 2. SET UP THE INTERCEPT
  await page.route('https://practice.expandtesting.com/notes/api/notes', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ message: 'No notes found', data: []}), 
    });
  });

  // 3. NAVIGATE TO TRIGGER THE INTERCEPT -
 await page.goto('https://practice.expandtesting.com/notes/app');

  // Now verify that your fake "empty" data is reflected in the UI
  // Verify that you dont see the created Note in the UI
  await expect(page.getByTestId("progress-info")).toBeHidden();
  //logout
  await page.getByTestId("logout").click();

});