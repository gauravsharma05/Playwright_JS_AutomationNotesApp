const {test,expect,request} =   require('@playwright/test');

// This will create a Note via the API and verify its been created via the UI.
// It will then Delete the created Note via API and verify its been deleted via the UI.

const loginPayload = new URLSearchParams({
  email: 'test1234@yahoo.com',
  password: 'password'
});

let token;
let userId;
const notePayload = {title:"Test 5",description:"this is the description",category:"Home"};
const email = "test1234@yahoo.com";
const password = "password";
const noteTitle = "Test 5";

test("API Create and UI Verify",async({page})=>
{
   // Login via API call -------------------------------------------------------
    const newContext = await request.newContext();

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
   userId = loginResponseJson.data.id;
   token = loginResponseJson.data.token;
   console.log(token);
   console.log(userId);

   // Create a new Note via the POST API -------------------------------

const createNotesResponse =  await newContext.post("https://practice.expandtesting.com/notes/api/notes",
                                 {                                
                                headers:
                                   {
                                         'x-auth-token':token,
                                         'Content-Type': 'application/json'
                                   },
                                data:notePayload
                                 });
  
  const createJson = await createNotesResponse.json();
  console.log(createJson);
  expect(createNotesResponse.ok()).toBeTruthy();
  const id = createJson.data.id;
console.log("id is : " + id);

  // UI Part - User goes to the Notes app and checks that the "Test 5" note is present and then deletes it
  
  await page.goto('https://practice.expandtesting.com/notes/app');
  
  // Login via the UI ----------------------------------------------
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button",{name:"Login"}).click();


  //Verify that the new note has been created in the UI -------------
  await page.getByText(noteTitle).isVisible();
  await page.getByText(noteTitle).waitFor();
  expect(page.getByText(noteTitle)).toBeVisible();

  // Now call the Delete API to delete the Note that you created.------

  const deleteNotesResponse =  await newContext.delete(`https://practice.expandtesting.com/notes/api/notes/${id}`,
                                             {                                
                                headers:
                                   {
                                         'x-auth-token':token,
                                   }
                                });
            expect(deleteNotesResponse.ok()).toBeTruthy();// Validate the delete response
            const deleteJson = await deleteNotesResponse.json();
            console.log(deleteJson);                      
            const deleteMessage = deleteJson.message;
            expect(deleteMessage).toBe("Note successfully deleted");

    //Verify in the UI the note has been deleted
   await page.goto('https://practice.expandtesting.com/notes/app');
  
   await expect(page.locator('[data-testid="note-card"]',{hasText:noteTitle})).toBeHidden();
                                

});
