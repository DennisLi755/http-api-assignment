const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type, Accept: type });
  response.write(content);
  response.end();
};

const createXMLResponse = (request, response, obj, status) => {
  let responseXML = '<response>';
  responseXML = `${responseXML}<message>${obj.message}</message>`;
  if (obj.id) responseXML = `${responseXML}<id>${obj.id}</id>`;
  responseXML = `${responseXML}</response>;`;
  respond(request, response, status, responseXML, 'text/xml');
};

const success = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'This is a successful response',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 200);
  }
  return respond(request, response, 200, JSON.stringify(responseObj), 'application/json');
};

const badRequest = (request, response, acceptedTypes, params) => {
  const responseObj = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseObj.message = 'Missing valid query parameter set to true';
    responseObj.id = 'badRequest';
    if (acceptedTypes[0] === 'text/xml') {
      return createXMLResponse(request, response, responseObj, 400);
    }
    return respond(request, response, 400, JSON.stringify(responseObj), 'application/json');
  }
  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 200);
  }
  return respond(request, response, 200, JSON.stringify(responseObj), 'application/json');
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const responseObj = {
    message: 'You have successfully viewed the content',
  };
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseObj.message = 'Missing loggedIn query parameter set to yes';
    responseObj.id = 'unauthorized';
    if (acceptedTypes[0] === 'text/xml') {
      return createXMLResponse(request, response, responseObj, 401);
    }
    return respond(request, response, 401, JSON.stringify(responseObj), 'application/json');
  }
  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 200);
  }
  return respond(request, response, 200, JSON.stringify(responseObj), 'application/json');
};

const forbidden = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 403);
  }
  return respond(request, response, 403, JSON.stringify(responseObj), 'application/json');
};

const internalServerError = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 500);
  }
  return respond(request, response, 500, JSON.stringify(responseObj), 'application/json');
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 501);
  }
  return respond(request, response, 501, JSON.stringify(responseObj), 'application/json');
};

const notFound = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'The page you were looking for was not found',
  };

  if (acceptedTypes[0] === 'text/xml') {
    return createXMLResponse(request, response, responseObj, 404);
  }
  return respond(request, response, 404, JSON.stringify(responseObj), 'application/json');
};
module.exports = {
  notFound,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internalServerError,
  notImplemented,
};
