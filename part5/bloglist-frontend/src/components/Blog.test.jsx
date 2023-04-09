import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('<Blog /> renders blog\'s title and author, but not its URL or likes by default', async () => {
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

  const { container } = render(<Blog blog={blog} loggedinUser={loggedinUser} />)

  const details = container.querySelector('.togglableDetails')
  expect(details).toHaveStyle('display: none')
})
