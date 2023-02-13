import bcrypt from 'bcrypt-nodejs';


const handleSignin = (req,res,db) => {
    
    const {email, password} = req.body;

    if (!email || !password)
    {
        return res.status(400).json('Incorrect form submission')
    }

    db.select('email','hash').from('login')
        .where('email','=',email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                    .where('email','=',email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'));
            }
            else
                throw ('credentials not valid');
        })
        .catch(err => res.status(400).json('Wrong credentials'));
    
    
}

export default handleSignin;