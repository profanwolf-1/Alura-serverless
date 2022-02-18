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
  const {pacienteId} = event
  const paciente = acharPaciente(pacienteId);
  const statusCode = paciente ? 200 : 400;
  const resposta = paciente ? paciente : "Paciente não encontrado";
  return {
    statusCode,
    body: JSON.stringify(
      {
        resposta
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
