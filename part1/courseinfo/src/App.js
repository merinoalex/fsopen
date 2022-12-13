function Header(props) {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
}

function Part(props) {
  return (
    <>
      <p>
        {props.name} {props.exercises}
      </p>
    </>
  );
}

const App = () => {
  const course = { 
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Content = (props) => {
    return (
      <>
        <Part name={course.parts[0].name} exercises={course.parts[0].exercises} />
        <Part name={course.parts[1].name} exercises={course.parts[1].exercises} />
        <Part name={course.parts[2].name} exercises={course.parts[2].exercises} />
      </>
    );
  }

  const Total = (props) => {
    return (
      <>
        <p>Number of exercises {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} </p>
      </>
    );
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App;
