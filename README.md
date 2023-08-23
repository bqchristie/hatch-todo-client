# Marvelous 2.0

Thanks for taking the time to review this project!

As I looked at the requirements for this project I was reminded of Trello with lanes of tasks. So for better worse that is the direction I took.

Although I was able to build in a lot of functionality beyond the scope of the project you could fairly call out as feature creep.  When I started the project I wanted to get something out of it for myself and have a bit of fun.

![](https://github.com/bqchristie/hatch-todo-client/blob/main/public/Marvelous%202.0.png)

## Where can I see it?
* You can see the project running at a [Linode server running here](http://172.105.110.150:8080/).  Sorry didn't have a domain and no cerbot.
* Alternatively you can run it locally by cloning the repo and running `npm install` and then `npm start`. (Just make sure the API is running as well)

## Additional Features
* So the biggest change is that instead of having checkboxes we have lanes where each lane represents a different status.
* The default states are "NEW" and "DONE" but we also included the ability to add new states in the contacts project on my include "IN PROGRESS" or "QA" but really it could be anything.
* I also added the ability to add new tasks to the board in the lane that  represents their current status.
* Each task has a both duplicate and delete button.
* If the task is duplicated immediately goes into the new state.
* In the top controls I added a button call "generate tasks" which will call the backend to generate 25 random task with different statuses this will fill up the board.  

## OK but what about the code
* I chose not to use a CSS framework not because I don't like them simply because I thought I'd be quicker with the time given to do things from scratch.
* I believe this was the right decision for this exercise but you can see already that the code for the CSS is not optimized.
* If I was going to move forward with this project I'd for sure at least introduced SCSS or potentially introduce tailwind or MUI or what have you.
* In terms of state management I used this opportunity to play around with react-query which turned out to be perfect for this particular task.
* Towards the end of things the state management was getting a bit muddy, and I'd probably introduced a context provider to clean that up.

### Functionality Issues
* The biggest issue has to do with Lanes.  At this point the lanes represent the unique statuses of the
tasks.
* This is fine until you refresh the page.  Tasks are all in the correct lanes but the lanes are not in the correct order.
* I did not have time to fix this.  Given time I would have liked to have done so.  Give more time I would create a model for task and give it a position, description etc.  At that poimt I'd be able to drag and drop the lanes as well.


### Code Issues
* OK the one with the big one that comes to mind that this is clearly not responsive. I did not have time to make it responsive.
* I am usually pretty good with responsive but, in this case I really have the mindset this that this was a desktop application.
* For me this was more of a design concern that coding concern. I accepted this deficiency for now and moved on.
* I have to admit that my style is usually to get the big ideas working the screen and then go back and re-factor.  
* This code is mostly functional but is indefinitely to have some cleanup. Usually I enjoy that part of it but I just ran out of time. 
* The modal for deleting the tasks was a last minute thing.  Given more time I would've created something more reusable (or swapped in a UI framework) but it is what it is.


Anyhow, I think it's a decent effort I hope there's no here that we can have a conversation in person. Again thanks for your time.


**NOTE: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).**




## Available Scripts

**NOTE: This section is all boilerplate from Create React App.**

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

