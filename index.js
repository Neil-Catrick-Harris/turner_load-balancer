const express = require('express');
const app = express();
const morgan = require('morgan');
const axios = require('axios');
const cors = require('cors');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const IPs = [];
const numIPs = IPs.length;
let ipIdx = 0;
const PORT = 3002;

app.get('/api/*', (req, res) => {
  axios.get(`http://${IPs[(ipIdx++) % numIPs]}${req.url}`)
    .then((response) => res.send(response.data));
});

app.get('/loaderio-*', (req, res) => {
  res.send(req.url.slice(1, -1));
});

app.post('/api/*', (req, res) => {
  axios.post(`http://${IPs[(ipIdx++) % numIPs]}${req.url}`, req.body)
    .then(result => res.send(result.data))
    .catch(err => res.sendStatus(400));
});

app.listen(PORT, () => console.log(`Load Balancer is listening on port ${PORT}`));
