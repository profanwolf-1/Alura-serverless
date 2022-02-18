'use strict';
let pacientes = []
for(let p = 0; p < 50; p++) {
  pacientes.push({
    id: p,
    nome: `Fulano${p}`,
    idade: 20+p
  })
}

function acharPaciente(id) {
  return pacientes.find(({id : _id}) => _id === id)
}

function filtrarMaiorIdade(idade) {
  return pacientes.filter(({idade: _idade}) => _idade > idade)
}
module.exports.listarPacientes = async (event) => {
  // const {idade} = event
  // const paciente = filtrarMaiorIdade(idade);
  return {
    statusCode: 200, 
    body: JSON.stringify(
      {
       pacientes
      },
      null,
      2
    ),
  };
};

module.exports.obterPaciente = async (event) => {
  const {id} = event.pathParameters;
  const paciente = pacientes.find(({id: _id}) => id == _id);
  return {
    statusCode: paciente ? 200 : 404, 
    body: JSON.stringify(
      {
        response: paciente ? {paciente} : {error: "Nenhum paciente encontrado" }

      },
      null,
      2
    ),
  };
}

