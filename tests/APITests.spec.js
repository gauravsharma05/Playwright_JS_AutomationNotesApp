const {test,expect,request} =   require('@playwright/test');

// These are some API calls to the APIs just to check their responses via playwright ----------

//const loginPayload = {userEmail:"gauravsharma051975@gmail.com",userPassword:"password"};
const loginPayload = new URLSearchParams({
  email: 'test1234@yahoo.com',
  password: 'password'
});

let token;
let userId;

test("API Test Login and Get Notes",async()=>
{
   // Login call -------------------------------------------------------
    const newContext = await request.newContext();

    const loginResponse = await newContext.post('https://practice.expandtesting.com/notes/api/users/login',
       {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          },
        data: loginPayload.toString()
      });
   //expect(loginResponse.ok()).toBeTruthy();
   const loginResponseJson = await loginResponse.json();
   console.log(loginResponseJson);
   userId = loginResponseJson.data.id;
   token = loginResponseJson.data.token;
   console.log(token);
   console.log(userId);
 
// Retrieve the notes -----------------------------------------------------------
const getNotesResponse =  await newContext.get("https://practice.expandtesting.com/notes/api/notes",
                                 {                                
                                headers:
                                   {
                                         'x-auth-token':token,
                                   },
                                 });
const getNotesResponseJson = await getNotesResponse.json();
console.log(getNotesResponseJson);
const title = getNotesResponseJson.data[0].title;
const message =  getNotesResponseJson.message;
console.log(title);
console.log(message);
expect(message).toBe("Notes successfully retrieved");
});



