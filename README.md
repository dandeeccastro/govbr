# Qual é o site mais importante do governo?

Usando as ferramentas dadas para mim durante minha aula de Álgebra Linear, decidi tentar responder essa pergunta. Esse projeto pretende ver até que ponto podemos levar o nível da aplicação matemática de algoritmos para a resolução de problemas comuns. Até que ponto podemos fazer a matemática nos dar uma nova interpretação da realidade?

## Como vou fazer isso?

Para chegar em algum resultado conclusivo, vou fazer uso das seguintes ferramentas:

- Algoritmo de rankeamento do Google, o **Pagerank**
- CSV com todos os sites de domínio gov.br, publicamente disponível no [Portal de Dados](http://dados.gov.br/) do governo brasileiro
- Projeto em Javascript, executado usando **Node.js**
- Implementação de interface gráfica usando **Electron**

## Plano

Agora um pouco sobre o projeto em si. Essa é a ideia geral que tive quando estava pensando em desenvolvê-lo

- Usar o banco de dados do portal de transparência do governo para ter acesso a todos os sites com o domínio gov.br
- Por meio de um webcrawler, acessar cada um dos sites dados e ver para quais outros sites do governo ele aponta
	- Desse jeito poderia coletar dados para o funcionamento do PageRank
- Coletada toda essa informação, processá-la usando o Algoritmo de PageRank para ranquear todos os sites do domínio, e assim saber qual o site mais importante do governo
- Extra: apresentar o resultado num grafo irado

## Problemas encontrados!

Atualmente o projeto está com os seguintes problemas:

- Ele demora mais de 7 horas para ser executado, pois alguns sites do governo já estão mortos faz muito tempo
- O algoritmo de PageRank me retorna um array de zeros

### TODO atual

- [ ] Entender como Observables funcionam no RxJS, para reduzir o tempo de execução do projeto.
- [ ] Consertar o algoritmo de Pagerank e fazer um teste controlado
- [ ] Implementar a UI em Electron
