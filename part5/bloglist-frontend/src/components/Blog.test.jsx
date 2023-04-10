import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Accountability in Software Development',
    author: 'Kent Beck',
    url: 'https://medium.com/@kentbeck_7670/accountability-in-software-development-375d42932813',
    likes: 0,
    user: {
      name: 'Arto Hellas'
    }
  }

  const loggedinUser = {
    username: 'hellas'
  }

  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        loggedinUser={loggedinUser}
      />).container
  })

  test('Renders blog\'s title and author, but not its URL or likes by default', () => {
    const details = container.querySelector('.togglableDetails')
    expect(details).toHaveStyle('display: none')
  })

  test('Blog\'s URL and likes are shown after "View" button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText(/view/i)
    await user.click(viewButton)

    const details = container.querySelector('.togglableDetails')
    expect(details).not.toHaveStyle('display: none')

    const url = screen.getByText(blog.url)
    const likes = screen.getByText(`${blog.likes} likes`, { exact: false })
    const name = screen.getByText(blog.user.name)
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()
  })
})
