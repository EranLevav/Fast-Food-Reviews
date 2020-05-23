module.exports = {

  serverError:(res) => {
    res.statusCode = 500; // 500==Internal Server Error
    return res.send({
      success: false,
      message: 'Error: Internal Server Error'
    });
  },
  clientError: (res, message)=> {
    res.statusCode = 400; // 400==Bad Request
    return res.send({
      success: false,
      message: message
    });
  },
  successResponse: (res, data)=> {
    res.statusCode = 200; // 200==Ok
    return res.send({
      success: true,
      data: data
    });
  },
  infoResponse: (res)=> {
    res.statusCode = 100; // 100==Continue
    return res.send({
      success: true,
      data: 'info: Continue'
    });
  }
};





