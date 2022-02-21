# Alura-serverless
Rep para treinar serverless ALURA

## instalações (Linux)

```py
    # Serverless framework
    sudo npm i -g serverless

    # Plugin offline 
    npm install serverless-offline --save-dev 

```
## Comandos utilizados

```py

#Iniciar um projeto (Node.js)
serverless create --template aws-nodejs --path nomedapasta

# Ver logs
sls logs -f nomeDaFuncao --tail

# Rodar localmente( precisa do plugin) 
sls offline

# Realizar deploy
    ## deploy
    sls deploy

    # Realizar deploy parcial ( apenas uma função )
    sls deploy -f nomeDaFuncao

# Inserir algo no dynamo com aws cli
aws dynamodb batch-write-item --request-items file://caminhoDoArquivo.json


# Invokar uma função
    #local 
    sls invoke local -f nomeDaFuncao -d "{}"
    
    #production
    sls invoke -f nomeDaFuncao -d "{}"


    #obs : Esse -d é para passar parametros no request.


```



