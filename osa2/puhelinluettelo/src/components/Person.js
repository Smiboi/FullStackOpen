const Person = ({ person, removePerson }) => {
  // console.log('person: ', person)
  return (
    <div>{person.name} {person.number} <button onClick={() => removePerson(person)}>delete</button></div>
  )
}

export default Person
