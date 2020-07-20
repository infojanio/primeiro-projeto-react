import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import { Link } from 'react-router-dom';

interface Repository {  //declaramos apenas o que será utilizado da api gitHub
full_name: string;
description: string;
owner: {
  login: string;
  avatar_url: string;
};
}

const Dashboard:React.FC = ()=> {

const [newRepositorio, setNewRepositorio] = useState(''); //estado para armazenar o valor digitado no input 
const [inputError, setInputError] = useState(''); //estado para armazenar erros no formulário
const [repositories, setRepositories] = useState<Repository[]>(() => { //<Repository[] criado na interface
  
  const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
  
  //verifica se tem alguma coisa no storagedRepositories
  if (storagedRepositories) {
    return JSON.parse(storagedRepositories); //Na busca temos passar o JSON para string
  } 
  else {
    return []; //senão retorna array vazio
    }
}); 

useEffect(() => {                                    //JSON.stringify transforma variável em JSON
localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
});


//1.Adição de um novo repositório, 2.Consumir a API do GitHub, 3.Salvar novo repositório no estado
async function handleAddReposity(event: FormEvent<HTMLFormElement>): Promise<void> { //FormEvent representa o submit do form
 
  event.preventDefault(); //Prevenir o comportamento padrão do formulário dentro do HTML
  
  if (!newRepositorio) { //Verifica se o input está vazio
    setInputError('Digite o autor/nome do repositório');
    return;  //não podemos esquecer do return, senão o código continuará executando
  }
       try {
  const response = await api.get(`repos/${newRepositorio}`);
  const repository = response.data; //Com o console.log(repository); conseguiremos ver o retorno de dados do api gitHub 
  setRepositories([...repositories, repository]); //recupera a lista e insere o novo repositório no fim do array
  
  setNewRepositorio(''); //Limpa o input para nova pesquisa
  setInputError(''); //caso não haja erros a mensagem estará vazia
} 
      catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
 <>
    <img src={logoImg} alt="GitHub Explorer" />
    <Title> Explorar repositórios no GitHub </Title>

    <Form hasError={!!inputError} onSubmit={handleAddReposity}>
        <input 
        value= {newRepositorio}
        onChange= {(e) => setNewRepositorio(e.target.value)}
        placeholder="Digite o nome do repositório"/>
        <button type = "submit"> Pesquisar </button>
    </Form>

  {inputError && <Error>{inputError}</Error> }     

    <Repositories>      
      {repositories.map(repository =>(
        
        <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
        <img 
        src= {repository.owner.avatar_url} 
        alt={repository.owner.login}
        />
        
        <div>
          <strong> {repository.full_name} </strong>
          <p> {repository.description} </p>

        </div>      
        <FiChevronRight size={20} /> 
        </Link>
      )
      )}
    </Repositories>

  </>
    );
};
export default Dashboard;