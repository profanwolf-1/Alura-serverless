'use strict';
const pacientes = []
for(let p = 0; p < 10; p++) {
  pacientes.push({
    id: p,
    nome: `Fulano${p}`,
    idade: 20+p
  })
}

const {v4: uuid} = require("uuid")
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

module.exports.cadastrarPaciente = async (event) => {
  const {nome, data_nascimento, email, telefone} = JSON.parse(event.body);
  const paciente = {
    paciente_id: uuid(),
    nome,
    data_nascimento,
    email,
    telefone,
    status: true,
    criado_em: new Date().getTime(),
    atualizado_em: new Date().getTime()
  }

  await dynamoDB.put({
    TableName: "PACIENTES",
    Item: paciente
  }).promise()
  return {
    statusCode: 201
  }
}

module.exports.atualizarPaciente = async (event) => {
  const { id } = event.pathParameters
  const {nome, data_nascimento, email, telefone} = JSON.parse(event.body)
  try {
    await dynamoDB
    .update({
      ...params,
      Key: {
        paciente_id: id
      },
      UpdateExpression:
        'SET nome = :nome, data_nascimento = :dt, email = :email,' + ' telefone = :telefone, atualizado_em = :atualizado_em',
        ConditionExpression: 'attribute_exists(paciente_id)',
        ExpressionAttributeValues: {
          ':nome': nome,
          ':dt': data_nascimento,
          ':email': email,
          ':telefone': telefone,
          ':atualizado_em': new Date().getDate().toString()
        }
    }).promise()

    return {
      statusCode: 204,
    }
  } catch(err) {
    return {
      statusCode: 400,
      body: err.message
    }
    
  }
}

module.exports.excluirPaciente = async (event) => {
  const { id } = event.pathParameters
  try {
    await dynamoDB
    .delete({
      ...params,
      Key: {
        paciente_id: id
      },
        ConditionExpression: 'attribute_exists(paciente_id)',
    }).promise()

    return {
      statusCode: 204,
    }
  } catch(err) {
    return {
      statusCode: 400,
      body: err.message
    }
    
  }
}

