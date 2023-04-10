import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm />\'s form calls the event handler with the right details when adding a new blog', async () => {
  const mockHandler = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  const title = inputs[0]
  const author = inputs[1]
  const url = inputs[2]
  const submitButton = screen.getByText('Add')
  const blog = {
    title: 'Accountability in Software Development',
    author: 'Kent Beck',
    url: 'https://medium.com/@kentbeck_7670/accountability-in-software-development-375d42932813'
  }

  await user.type(title, blog.title)
  await user.type(author, blog.author)
  await user.type(url, blog.url)
  await user.click(submitButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe(blog.title)
  expect(mockHandler.mock.calls[0][0].author).toBe(blog.author)
  expect(mockHandler.mock.calls[0][0].url).toBe(blog.url)
})
