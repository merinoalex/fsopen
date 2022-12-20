const Header = ({ course }) =>
  <h2>
    {course.name}
  </h2>

const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </>
  )
}

const Total = ({ sum }) =>
  <p><strong>total of {sum} exercises</strong></p>

const Course = ({ course }) => {
  const total = course.parts.map(part => 
    part.exercises).reduce((sum, currentValue) => 
    sum + currentValue, 0)

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total sum={total} />
    </div>
  )
}

export default Course