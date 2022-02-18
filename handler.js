'use strict';
let pacientes = []
for(let p = 0; p < 50; p++) {
  pacientes.push({
    id: p,
    nome: `Fulano${p}}`,
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
  const {idade} = event
  const paciente = filtrarMaiorIdade(idade);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
       paciente 
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
