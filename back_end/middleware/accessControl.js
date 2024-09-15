
function isAdmin(req, res, next) {
    if (req.user.user_type !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

/*
    The following 2 functions test if users are either a lecturer or student, also tests for admin users,
    they have full priviledges of students and lecturers combined
*/

function isLecturer(req, res, next){
    if (req.user.user_type !== 'lecturer' && req.user.user_type !== 'admin'){
        return res.status(403).json({ message: 'Access denied. Lecturers only.' });
    }
    next();
}

function isStudent(req,res,next){
    if (req.user.user_type !== 'student' && req.user.user_type !== 'admin'){
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    next();
}

module.exports = {
    isAdmin,
    isLecturer,
    isStudent
};
