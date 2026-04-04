const {test,expect} =   require('@playwright/test');

test('UI only test', async ({browser})=>
{
  const context = await browser.newContext();
  const page =  await context.newPage();
  const noteTitle = "Test 54321";
  const description = "This is the description for the note added via Playwright";
  const email = "test1234@yahoo.com";
  const password = "password";

  await page.goto('https://practice.expandtesting.com/notes/app');
  console.log(await page.title());

  await page.getByRole("button",{name:"Consent"}).click();

  // Login via the UI ----------------------------------------------
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button",{name:"Login"}).click();
  const text = await page.locator(".mt-2").textContent();

// click on the button to add a new Note---------------------------
await page.getByTestId("add-new-note").click();

// Enter the title and description and click on Submit ------------
await page.locator("#title").fill(noteTitle);
await page.locator("#description").fill(description);
await page.getByTestId("note-submit").click();

//Verify that the new note has been created in the UI -------------
await page.getByText(noteTitle).isVisible();
expect(page.getByText(noteTitle)).toBeVisible();

// Click on the delete button for the title noteTitle  ---------------------
//Find the card containing the title
const card = page.locator('[data-testid="note-card"]', { hasText: noteTitle });
//Locate the Delete button inside that card
const deleteButton = card.locator('[data-testid="note-delete"]');
await deleteButton.click();
// click on the Confirm Delete button
await page.getByTestId("note-delete-confirm").click();

 // Verify that the note has now been deleted from the UI
await expect(page.locator('[data-testid="note-card"]',{hasText:noteTitle})).toBeHidden();
});