const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');

const { renderView, renderComponent } = require('./utils/render');

const chatMessages = require('./chatDB.json');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [
  {
    username: 'test1',
    email: 'test1@test.com',
    password: 'test1234'
  },
  {
    username: 'test2',
    email: 'test2@test.com',
    password: 'test1234'
  },
  {
    username: 'test3',
    email: 'test3@test.com',
    password: 'test1234'
  },
  {
    username: 'test3',
    email: 'test3@test.com',
    password: 'test1234'
  }
]

function authMiddleware(req, res, next) {
  console.log('auth middleware ho!');
  next();
}

app.use('/dashboard', authMiddleware, require('./controllers/dashboard'));

app.get('/', (req, res) => {
  renderView({
    view: 'home',
    state: {
      metadata: {
        title: 'Home Page'
      }
    },
    useLayout: !req.headers['hx-request']
  })
  .then(htmlString => {
    res.send(htmlString);
  })
  .catch(console.log);
});

app.get('/about', (req, res) => {
  renderView({
    view: 'about',
    state: {
      metadata: {
        title: 'About Page'
      }
    },
    useLayout: !req.headers['hx-request']
  })
  .then(htmlString => {
    res.send(htmlString);
  })
  .catch(console.log);
});

app.get('/contact', (req, res) => {
  renderView({
    view: 'contact',
    state: {
      metadata: {
        title: 'Contact Page'
      }
    },
    useLayout: !req.headers['hx-request']
  })
  .then(htmlString => {
    res.send(htmlString);
  })
  .catch(console.log);
});

app.get('/chat', (req, res) => {
  renderComponent({
    component: 'chat',
    state: {
      data: {
        messages: chatMessages
      }
    }
  })
  .then(htmlString => {
    res.send(htmlString);
  })
  .catch(console.log);
});

app.post('/chat', (req, res) => {
  chatMessages.unshift({
    createdAt: new Date().toISOString().slice(0,10).replace(/-/g,""),
    text: req.body.message
  });

  renderComponent({
    component: 'chat',
    state: {
      data: {
        messages: chatMessages
      }
    }
  })
  .then(htmlString => {
    res.send(htmlString);
  })
  .catch(console.log);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);

  const messageWriteInterval = setInterval(() => {
    fs.writeFile('./chatDB.json', JSON.stringify(chatMessages), err => {
      if(err) console.log(err);

      console.log('Wrote messages to db');
    });
  }, 30000);
});