# Part 5 - Testing React apps

## Useful information

- To clone a repo, navigate to the `part 5` directory and run `git clone <url>`
- After cloning, run `npm install` to install all the dependencies and node modules
- Start the backend worked from the previous part with `npm run dev`, it will run on **port 3001**
- In a separate terminal, run the frontend with `npm start`
- :x: Don't mix `async`/`await` and `then` syntax inside the same code to avoid problems
- Ignore eslint anonymous export error with a `// eslint-disable-next-line import/no-anonymous-default-export` comment
- Conditional rendering in React with the `&&` trick
- Refactor/extract single logical entities into their own components
  - State and functions defined outside components are passed down as *props*
  - Child components
  - Lift the shared state up to their closest common ancestor
- Log out of the application through the console using `window.localStorage.clear()`
- Minimize the risk of XSS attacks
- `npm audit fix --force` causes the app not to work

## Bloglist App Frontend

The application was initially cloned from [the base solution](https://github.com/fullstack-hy2020/bloglist-frontend). 

### App

- Login form
  - State variables for username and password
  - Handlers
  - Logging in is done via an HTTP POST request to server address *api/login*
  - *services/login.js* module
  - On login success, server response (including token and user details) are saved to *user* field of app's state
  - The login details are saved to local storage, parsed to JSON
  - An effect hook parses this JSON data to verify the user is still logged-in
- Blogs
  - The token of the logged-in user is added to the *Authorization* header of the HTTP request when creating new entries, received by **axios**
  - A GET request (and the blog db state is updated) is made every time a blog is added, updated or deleted to show all up-to-date information
  - [Part 4](../part4/) backend was updated to support update and delete operations
  - Blog entries are sorted descending by the number of likes
- Togglable component
  - References are used to trigger it after blog creation, kept throughout re-renders
- Likes button
  - Likes are increased by making an HTTP PUT request to *api/blogs/{id}*, replacing the entire blog entry

### Dependencies

- [prop-types](https://github.com/facebook/prop-types)
  - PropTypes are checked on Togglable, LoginForm and BlogList components
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)
  - Replaced create-react-app default eslint
  - Added VSCode workspace and settings for ESLint plugin to work correctly
  - :x: Don't run `eslint --init`, as it will install the latest ESlint version that isn't compatible with the create-react-app config file
  - `npm install --save-dev eslint-plugin-jest`
  - *.eslintrc.js* file contains configuration

***

## Full Stack developer's oath

- I will have my browser developer console open all the time
- I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
- I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
- I will keep an eye on the database: does the backend save data there in the right format
- I progress with small steps
- **When I suspect that there is a bug in the frontend, I make sure that the backend works for sure**
- **When I suspect that there is a bug in the backend, I make sure that the frontend works for sure**
- I will write lots of `console.log` statements to make sure I understand how the code and the tests behave and to help pinpoint problems
- If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything still was still working
- If a test does not pass, I make sure that the tested functionality for sure works in the application
- When I ask for help in the course Discord or Telegram channel or elsewhere I formulate my questions properly, [see here how to ask for help](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram)