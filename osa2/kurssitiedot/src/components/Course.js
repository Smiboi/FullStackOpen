const Header = (props) => {
    return <h2>{props.course}</h2>
}

const Total = (props) => {
  return <b>Total of {props.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b>
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = (props) => {
  return (
    props.parts.map(part => <Part key={part.id} part={part} />)
  )
}

const Course = (props) => {
  return(
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  )
}

export default Course
