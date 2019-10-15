const express = require('express');

const server = express();
server.use(express.json());

//Meu Middleware global para contar requisicoes feitas ao servidor.
server.use(countRequest);



/* ################
  DESAFIO: Crie uma aplicação para armazenar projetos e suas tarefas do zero utilizando Express.
  ################ */

let numberOfRequests = 0;
const projects = [];


/* CADASTRA PROJETO */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(project);
}); 


/* ROTA QUE LISTA TODOS PROJETOS E SUAS TAREFAS */
server.get('/projects', (req, res) => {
  return res.json(projects);
}); 


/* ROTA QUE ALTERA APENAS O TITULO DO PROJETO */
server.put('/projects/:id', checkProjectExists, (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
}); 


/* ROTA QUE DELETA O PROJETO  */
server.delete('/projects/:id', checkProjectExists, (req, res) => {

  const { id } = req.params;

  const projectIndex = projects.find(p => p.id == id);
  projects.splice(projectIndex, 1);

  return res.send();
}); 


/* CADASTRA TAREFA EM UM PROJETO */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
}); 




/* ################
  Middlewares
  ################ */


/*
  1 - Middleware local que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. 
  Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;
*/
function checkProjectExists(req, res, next){
  const project = projects.find(p => p.id == req.params.id);

  if(!project){
    return res.status(400).json({ error: 'Project does not exists' });
  }

    //Caso o projeto seja encontrado, adiciono ele dentro do req para ficar disponível para utilizar nos endpoint.
    req.project = project;
    return next();
}

/*
  2 - Crie um Middleware global chamado em todas requisições que imprime (console.log) 
  uma contagem de quantas requisições foram feitas na aplicação até então; 
*/
function countRequest(req, res, next){
  numberOfRequests++;
  console.log(`Request: ${numberOfRequests}`);
  next();
};


server.listen(3000);