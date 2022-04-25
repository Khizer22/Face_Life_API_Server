const handleProfile = (req,res,db) => {
    const id = req.params.id;

    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length)
            res.json(user[0]);
        else 
            throw ('err');
    })
    .catch(err => res.status(400).json('Error getting user'));
}

export default handleProfile;