'use strict';
const pacientes = []
for(let p = 0; p < 10; p++) {
  pacientes.push({
    id: p,
    nome: `Fulano${p}`,
    idade: 20+p
  })
}

const { DynamoDB } = require('aws-sdk');
const AWS = require('aws-sdk')
const params = {
  TableName: 'PACIENTES'
}
function acharPaciente(id) {
  return pacientes.find(({id : _id}) => _id === id)
}

function filtrarMaiorIdade(idade) {
  return pacientes.filter(({idade: _idade}) => _idade > idade)
}
const dynamoDB = new AWS.DynamoDB.DocumentClient()


module.exports.listarPacientes = async (event) => {
  // const {idade} = event
  // const paciente = filtrarMaiorIdade(idade);
  try {
    const data = await dynamoDB.scan(params).promise()
    return {
      statusCode:200,
      body: JSON.stringify(data.Items)
    }
  } catch(err) {
    console.log("Error", err.message)
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error"
      })
    }
  }
};

module.exports.obterPaciente = async (event) => {
  try {
    const { id } = event.pathParameters;
    console.log(event)
    const data = await dynamoDB.get({
      ...params,
      Key: {
        paciente_id: id
      }
    }).promise()

    if(!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Paciente não existe'}, null, 2)
      }
    }
    const paciente = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify(paciente, null, 2)
    }
  } catch(err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown error'
      })
    }
  }
}

