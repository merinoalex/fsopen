const BlogForm = ({ addBlog, newBlogTitle, newBlogAuthor, newBlogUrl, setNewBlogTitle, setNewBlogAuthor, setNewBlogUrl }) => {
  return (
    <div>
      <h2>Add new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title: 
          <input
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          Author: 
          <input 
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          URL: 
          <input 
            type="text"
            value={newBlogUrl}
            name="URL"
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default BlogForm
