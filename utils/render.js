const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '..', 'views');
const componentsDir = path.join(__dirname, '..', 'components');

function html(templateString, templateState) {
  return new Function('return `' + templateString + '`;').call(templateState);
}

function renderTemplate(file, state) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${file}.html`, 'utf8', (err, htmlData) => {
      if(err) reject(err);

      return resolve(html(htmlData, state));
    });
  });
}

function renderView({ view, state, useLayout }) {
  const viewState = {
    metadata: {},
    data: {},
    ...state
  }

  if(useLayout) {
    return Promise.all([
      renderTemplate(`${viewsDir}/topLayout`, viewState),
      renderTemplate(`${viewsDir}/${view}`, viewState),
      renderTemplate(`${viewsDir}/bottomLayout`)
    ])
    .then(results => {
      return new Promise((resolve, reject) => {
        resolve(results.join(''));
      });
    });
  } else {
    return renderTemplate(`${viewsDir}/${view}`, viewState)
  }
}

function renderComponent({ component, state }) {
  const compState = {
    data: {},
    ...state
  }

  return renderTemplate(`${componentsDir}/${component}`, compState);
}

module.exports = {
  renderView,
  renderComponent
}