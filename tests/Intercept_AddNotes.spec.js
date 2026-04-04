 const {test,expect,request} =   require('@playwright/test');
 
 const loginPayload = new URLSearchParams({
   email: 'test1234@yahoo.com',
   password: 'password'
 });
 const email = "test1234@yahoo.com";
 const password = "password";
 
 test('Demo Network Intercept - Add Notes', async ({ page }) => {
   // Login via the UI and check that you have Notes getting displayed first in the UI
   
    await page.goto('https://practice.expandtesting.com/notes/app');
   await page.getByRole('link', { name: 'Login' }).click();
   await page.locator("#email").fill(email);
   await page.locator("#password").fill(password);
   await page.getByRole("button",{name:"Login"}).click();
   const text = await page.getByTestId("progress-info");

  await expect(text).toHaveText("You have 0/1 notes completed in the all categories");

    // 2. SET UP THE INTERCEPT - Add fake data via the intercept ----------------------
  await page.route('https://practice.expandtesting.com/notes/api/notes', async (route) => {
  await route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({
    success: true,
    status: 200,
    message: 'Notes successfully retrieved',
       data: [
          {
             id: '1',
             title: 'Note 1',
             description: 'Description 1',
             completed: false,
          },
          {
             id: '2',
             title: 'Note 2',
             description: 'Description 2',
             completed: true,
          }
            ]
        })
        });
        });
     
 // 3. NAVIGATE TO TRIGGER THE INTERCEPT ---------------------------------
 await page.goto('https://practice.expandtesting.com/notes/app');
 
   // Verify that the fake data is viewable on the UI ---------------------
  await expect(page.getByText("Note 1")).toBeVisible();
  await expect(page.getByText("Note 2")).toBeVisible();


});