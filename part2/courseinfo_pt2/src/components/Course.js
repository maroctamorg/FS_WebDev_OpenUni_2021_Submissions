import React from 'react'

const Part = (props) => {
    return (
        <p> {/* could also  */}
        {props.name} {props.exercise_number}
        </p>
    )
}

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Content = ( {parts} ) => parts.map(part => <Part key={part.id} name={part.name} exercise_number={part.exercises} />)

const Total = ( {parts} ) => {
    return (
        <strong>Total of { parts.reduce( (s, p) => {
            let a = { ...s }
            a.exercises += p.exercises
            return ( a )
        }
        ).exercises } exercises</strong>
    )
}

const Course = ( {course} ) => (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course