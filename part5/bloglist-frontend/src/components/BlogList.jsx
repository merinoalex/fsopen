import Blog from "./Blog"

const BlogList = ({ blogs, updateBlog }) => {
  const list = blogs.sort((a, b) => a.likes - b.likes).reverse()

  return (
    list.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        editBlog={updateBlog}
      />
    )
  )
}

export default BlogList
