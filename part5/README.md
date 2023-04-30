# Part 5 - Testing React apps

## Useful information

- To clone a repo, navigate to the `part 5` directory and run `git clone <url>`
- After cloning, run `npm install` to install all the dependencies and node modules
- Start the backend worked from the previous part with `npm run dev`, it will run on **port 3001**
- In a separate terminal, run the frontend with `npm start` (it will run on **port 3000**)
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

- **Login form**
  - State variables for username and password
  - Handlers
  - Logging in is done via an HTTP POST request to server address *api/login*
  - *services/login.js* module
  - On login success, server response (including token and user details) are saved to *user* field of app's state
  - The login details are saved to local storage, parsed to JSON
  - An effect hook parses this JSON data to verify the user is still logged-in
- **Blogs**
  - The token of the logged-in user is added to the *Authorization* header of the HTTP request when creating new entries, received by **axios**
  - A GET request (and the blog db state is updated) is made every time a blog is added, updated or deleted to show all up-to-date information
  - [Part 4](../part4/) backend was updated to support update and delete operations
  - Blog entries are sorted descending by the number of likes
  - *services/blogs.js* module
- **Togglable component**
  - References are used to trigger it after blog creation, kept throughout re-renders
- **Likes button**
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

### Testing

#### Jest

- Tests are implemented with Jest, just as in the last part
- *Create-react-app* apps come configured with Jest by default
- Rendering React components is aided by the [react-testing-library](https://github.com/testing-library/react-testing-library)
  - `npm install --save-dev @testing-library/react @testing-library/jest-dom`
  - [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) provides custom DOM element matchers for Jest
- Following the convention to write tests' files alongside the components files (according to *create-react-app* config)
- Either run tests with `npm test` (with watch mode) or `$env:CI=$true; npm test` (normal) for PowerShell
  - May need to install [Watchman](https://facebook.github.io/watchman/)
- [user-event](https://testing-library.com/docs/user-event/intro/) library facilitates simulating user input
  - `npm install --save-dev @testing-library/user-event`
- Find out the coverage of tests by running `$env:CI=$true; npm test -- --coverage`

- **Tools**
  - `render(element)` (rtl)
    - Returns `container` object
      - Can use `querySelector` to find elements according to their selectors
      - `const { container } = render(<Note note={note} />)`
  - `screen` object accesses the rendered elements (rtl)
    - ByText
    - ByTestId
    - ByRole
    - ByPlaceholderText
    - `debug()`
    - `getByText(text, { exact: false })`
      - Options to look for an element *containing* some text
  - Queries (rtl)
    - Single element
      - getBy
        - *Throws an error* on no match (or multiple), returns *element*
        - Doesn't require `expect` assertion
      - queryBy
        - *Returns `null`* on no match (or error for multiple), returns *element*
      - findBy
        - *Throws an error* on no match (or multiple), returns *element*, *retries*
        - Doesn't require `expect` assertion
        - Returns a promise
    - Multiple elements (return arrays)
      - getAllBy
      - queryAllBy
      - findAllBy
  - Matchers (jest-dom)
    - `toHaveTextContent(text)`
    - `toHaveStyle(css)`
  - Mock objects (Jest)
    - `jest.fn()`
  - Sessions (ue)
    - `userEvent.setup()`
    - `click(element)`
    - `type(element, text)`

- **Tests**
  - `mockHandler.mock.calls[0][0]` refers to the *first call* and its *first argument* respectively
  - `TogglableDetails` on `<Blog />` is the only test-specific class used by `querySelector`

#### Cypress

- Install Cypress as a dev dependency 
  - `npm install --save-dev cypress`
- Run cypress on a terminal `npx cypress open` or through its own npm-script
- Cypress tests can be in the frontend's, backend's or their own separate repo
  - They require the tested system to be running
- Added an npm script to the *bloglist backend* in Part 4 to start it in test mode *(NODE_ENV=test)* - `npm run start:test`
- When backend and frontend are running, start Cypress with `npm run cypress:open`
  - Had to update the test database to hold necessary values, such as user id in blog posts, and name for root user
- Avoid using arrow functions to access Mocha's context
- Install eslint-plugin-cypress as a dev dependency
  - `npm install eslint-plugin-cypress --save-dev`
  - Change *.eslintrc.js* to consider Cypress
- Consider all changes to the browser's state are reset after each test
- Added an API endpoint to the *bloglist backend* for clearing the test database by making an HTTP POST request to */api/testing/reset*
- CSS properties behave differently on Firefox (`border-style`, `border-radius` and `padding`), they may cause error with tests
- Cypresss commands don't **return** values, instead they **yield** them
- Changed line endings from CRLF to LF

- **Tools**
  - `describe(title, fn)` blocks
  - `it(title, fn)` for test cases
    - `it.only` to only run this test
    - `it.skip` to skip it
  - Cypress commands
    - Queries
      - `cy.contains()`
        - Get DOM element *containing* text
      - `cy.get()`
        - Get one or more DOM elements by selector or **alias**
      - `cy.find()`
        - Get descendent DOM elements of a specific selector
      - `cy.children()`
        - Get children of each DOM element within a set of DOM elements
    - Actions
      - `cy.click()`
      - `cy.type()`
    - Assertions
      - `.should()`
        - Automatically retries until pass or timeout
      - `.and()`
        - Alias of `.should()` for chaining after it
    - `cy.visit()`
    - `cy.request()`

- **Tests**
  - Added a *baseUrl* and an environment variable for the backend
  - I use the `name` attribute on the input fields for login to more reliably select them
  - Test login flow only once; bypass the UI for subsequent tests
    - Added custom `login` and `addBlog` commands to create cleaner code
  - → At 5.19, figured I forgot to add `setToken` at the Effect Hook for validating the logged-in user, which was causing requests to add a blog to be sent without a token
    - Enabled logging for test environment
  - Wrapped the blog list items in a `div` with id *"#blog-list"* to select it during tests
  - Used `.children()` and `.find()` to select the specific blog entry we are targeting at tests
  - Test ensuring only the creators can delete their own entries bypasses UI to create a new user and login, and finally checks there is no *"Remove"* button 

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