import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import api from "../../services/api";
import { Link } from 'react-router-dom';

import logoImg from "../../assets/logo.svg";


import { Title, Form, Repositories, Error } from "./styled"

interface Repository {
  full_name: string
  owner: {
    login: string,
    avatar_url: string,
  }
  description: string,
}
const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState("");
  const [newRepo, setNewRepo] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(`@GithubExplorer:repositories`)

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories)
    } else {
      return [];
    }

  });




  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories),
    );

  }, [repositories])



  async function handleAddRepository(event: FormEvent<HTMLFormElement>):
    Promise<void> {

    event.preventDefault();

    if (!newRepo) {
      setInputError("Digite o autor/nome do repositório");
      return;
    }

    try {

      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
    } catch (err) {
      setInputError("Esse repositório não foi encontrado.")
    }

  }
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />

      <Title>Explore repositórios no GitHub</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>


        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Nome do repositório desejado" />
        <button type="submit"> Pesquisar </button>
      </Form>

      {inputError && <Error>{inputError}</Error>}


      <Repositories>
        {repositories.map(repository => (

          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`} >

            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong> {repository.full_name} </strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>))}

      </Repositories>

    </>
  );
};

export default Dashboard;



