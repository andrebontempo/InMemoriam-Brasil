const AuthController = {
    login: (req, res) => {
        res.render('login', { title: 'Login - In Memoriam Brasil' });
    }
};

module.exports = AuthController;
