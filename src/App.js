import React, {useState, useEffect} from 'react';
import './App.css';
import {Form, Card, Image, Icon} from 'semantic-ui-react';

function App() {

  /*
    Set all the const of what we need from the api.
    We receive the call from the fetch and set it by "setXXX" to the useState.
    Using Arrays with repos so we can .map() them later.
    Setting the error to null as the first state to later control it
  */
  const [name, setName] = useState('');
  const [userName, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [repos, setRepos] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');  
  const [filteredRepos, setFilteredRepos]= useState([]);
    

  /* 
    Fetching the data from the github api.
    We update the const above from it.
    Creating an "empty" data.
  */

  useEffect(() => {
     fetch('https://api.github.com/users/example')
     .then(res => res.json())
     .then(data => { 
      setData(data);
     });
  }, [] );

  /*
    Filling the empty data with all the params received.
    First, we set the params that we would like to receive and then update them.
  */

  const setData = ({
    name,
    login,
    followers,
    following,
    avatar_url
  }) => {
     setName(name);
     setUsername(login);
     setFollowers(followers);
     setFollowing(following);
     setAvatar(avatar_url); 
  };

  
  /*
    While creating a form, we 
  */

  const handleSearch =  (e) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = () => {
     fetch(`https://api.github.com/users/${userInput}`)
     .then(res => res.json())
     .then(data => {
       if ( data.message ){
         setError(data.message )
       } else {
       setData(data);
       setError(null);
       }
     });

     fetch(`https://api.github.com/users/${userInput}/repos`)
     .then(res  => res.json())
     .then(repos => { 
       if (repos.message) {
         setError(repos.message)
       } else {
      setRepos(repos);
      setError(null)
    }
     });
    
  }  

  useEffect(() => {
    setFilteredRepos(
      repos.filter( repo => {
        return  repo.name.toLowerCase().includes( search.toLowerCase() )
       })
    )
  }, [search, repos])

  return (
    <div>
      <div className="navbar">Github Repositories With Search Functionality</div>
      
        <div class="row">
          <div class="column">
          <div className="search">
      <Form onSubmit={handleSubmit }>
          <Form.Group>
            <Form.Input  placeholder='Github User' name='github user' onChange={handleSearch} /> 
            <Form.Button content='Search!'/>
          </Form.Group>
        </Form>
      </div>
      {error? (<h1>{error}</h1> ) : (

        <div className="card">
        <Card>
          <Image src={avatar} wrapped ui={false}/>
          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Header>{userName}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <a href={`https://github.com/${userName}?tab=followers`}>
              <Icon name='user' />
              {followers} followers          
            </a>
          </Card.Content>
         
          <Card.Content extra>
            <a href={`https://github.com/${userName}?tab=following`}>
              <Icon name='user' />
              {following} Following
            </a>
          </Card.Content> 
        </Card>
        </div>
      ) }

          </div>

      <div class="column">
          <input className="repos-search" type="text"  placeholder="Filter Repositories" onChange={ e => setSearch(e.target.value)}/>
      <ul className="repo-list">
      {filteredRepos.map(repo => {
        return <li key={repo.id} className="repo-item">
        <a href={repo.html_url}>{repo.name}</a> 
        <p className="repo-description">{repo.description}</p>
      <p className="repo-language"> Language: {repo.language}   
      <br/>
      Forks: {repo.forks}</p>
          <hr/>
        </li>
      })}
      </ul>

          </div>
        </div>




    </div>
  );
}

export default App;
