const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
var express = require('express');
var request = require('request');
var app = express();


if (cluster.isMaster) {
	
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

} else {
  
  /**
	 * 
	 * 
	 * @param  {int} porta
	 * @return {function} callback
	 */
	app.listen(3000, function () {
		console.log('servidor rodando na porta 3000');
	});

	var keyID = '491e283f232c';
	var userID = '535861013';

	/**
	 * Retorna o captcha
	 */
	app.get('/gerar-captcha', function (req, res) {
		let url = `https://server3.fsist.com.br/baixarxml.ashx?m=WEB&UsuarioID=${userID}&cte=0&pub=${keyID}&com=${keyID}&t=captcha&qtd=24`;

		let captcha = `<img src="${url}" alt="Imagem do Captcha" />`;
		res.send(captcha);
	});

	/**
	 * Retorna um objeto com a mensagem de resposta do serviço e o link do pdf para download
	 */
	app.get('/gerar-consulta/captcha/:captcha/chave-nfe/:nfe', function (req, res) {
		let url = `https://server3.fsist.com.br/baixarxml.ashx?m=WEB&UsuarioID=${userID}&cte=0&pub=${keyID}&com=${keyID}&t=consulta&chave=${req.params.nfe}&captcha=${req.params.captcha}&qtd=24`;
		request(url, function (errConsulta, resConsulta) {
			if (errConsulta) {
				console.log(errConsulta);
				res.send('erro ao requisitar consulta.');
			}

			let jsonResponse = {
				message: resConsulta.body,
				pdf: `https://server3.fsist.com.br/baixarxml.ashx?m=WEB&UsuarioID=${userID}&cte=0&pub=${keyID}&com=${keyID}&t=pdf&chave=${req.params.nfe}&captcha=${req.params.captcha}&qtd=24`
			}

			res.json(jsonResponse);
		})
	});


  console.log(`Worker ${process.pid} started`);
}