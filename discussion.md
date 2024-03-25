**- How did you prioritize your time?**

- I focused on essential tasks to ensure the core functionality of the to-do list was robust and bug-free. I also prioritized making the UI as simple and straightforward to use as possible for ease-of-use.
  - The features I prioritized are: adding, completing, editing, deleting, and seeing others' todos.
- To let users know that they can edit a todo, I added a title attribute to each todo div which pops up a small modal indicating that the todo is editable.
- I added a loading header at the top of the page to indicate the information was being loaded from the server.

**- What decision points did you come to, and how did you reach the decision you made? Are there any questions you would have asked if you could?**

- I made the decision to remove redundant features from the original application. For example I consolidated two headings which displayed "Status".
- I had to make a decision on how to display the todo list and status at the same time. I decided to give them equal spacing. However, a question I would ask a product team working on this feature is if we want to give equal spacing to status and todo. The status section can be a lot smaller because the todo functionality has been given its own space.

**- What would you do in this scenario if there was more time? What would come next? Is there anything you would change if you could do it again?**

- If I had more time I would do the following:
  - Make a more consistent design language between the status and todos.
  - Let users group todos based on priority.
  - Let users add to other people's todo lists - this could be helpful for supervisors to delegate tasks.
  - Persist todos to a database or to localStorage so that users can keep their todos across calls.
  - Add a pomodoro timer for productivity and time management.
  - Make the design responsive, this design has only been tested on a 1900 x 854 px screen.
