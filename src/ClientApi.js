import React, {useState, useEffect} from 'react';
import './App.css';
import {Form, Card, Image, Icon} from 'semantic-ui-react';

function ClientApi () {

// Use state to define all the variables that
// will be used and will be defined later

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

 // Fetch data from the Github Api

 useEffect(() => {
    fetch('https://api.github.com/users/example')
    .then(res => res.json())
    .then(data => { 
     setData(data);
    });
 }, [] );

 // Fill the componenents the Data received from the Github API

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

  // Receives the input from the form of "repos"

  const handleSearch =  (e) => {
   setUserInput(e.target.value)
 }

  // Update the default data from what we typed in the form.

  const handleSubmitAndReceiveUserInfo = () => {
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

    // fetch the repos separetly because it was returning an string 
    // and we want an object to .map() it

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

 // Filter the Repos that includes the input (e) from handlesearch()

 useEffect(() => {
   setFilteredRepos(
     repos.filter( repo => {
       return  repo.name.toLowerCase().includes( search.toLowerCase() )
      })
   )
 }, [search, repos])

  return (
    <div>
        <div class="row">
          <div class="column">
          <div className="search">
          <Form onSubmit={handleSubmitAndReceiveUserInfo}>
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
        ) 
      };
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
              })
              }
              </ul>
        </div>
        
      </div>
    </div>
  );
}

export default ClientApi;