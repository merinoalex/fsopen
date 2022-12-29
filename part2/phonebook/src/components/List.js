const Person = ({ person, deletePerson }) => {
    return (
      <p>
        {person.name}: 
        {person.number}&nbsp;
        <button onClick={deletePerson}>delete</button>
      </p>
    )
  }
  
const List = ({ show, deletePerson }) => {
  return (
      <div>
        {show.map(person =>
          <Person 
            key={person.id}
            person={person} 
            deletePerson={() => deletePerson(person.id)}
          />
        )}
      </div>
  )
}

export default List
