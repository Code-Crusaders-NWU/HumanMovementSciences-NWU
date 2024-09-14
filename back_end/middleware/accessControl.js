
function isAdmin(req, res, next) {
    if (req.user.user_type !== 'admin') {
        console.log('User Role:', req.user.user_type); // Debugging line
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

module.exports = isAdmin;
