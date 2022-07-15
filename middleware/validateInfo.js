function validateInfo(req, res, next) {
  const { username, email, password, role } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === '/register') {
    console.log(!email.length);
    if (![username, email, password, role].every(Boolean)) {
      return res.status(401).json('Missing Information');
    } else if (!validEmail(email)) {
      return res.status(401).json('Invalid Email');
    }
  } else if (req.path === '/login') {
    if (![username, password].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    }
  }

  next();
}

export { validateInfo };
