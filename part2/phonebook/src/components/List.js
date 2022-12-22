const Person = ({ person }) => {
    return (
      <p>{person.name}: {person.number}</p>
    )
  }
  
const List = ({ show }) => {
return (
    <div>
    {show.map(person =>
        <Person 
        key={person.id}
        person={person} 
        />)}
    </div>
)
}

export default List
