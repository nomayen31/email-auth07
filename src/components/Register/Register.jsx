import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../../firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app)
const Register = () => {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess('')
        setError('')
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value
        console.log(name, email, password);

        if(!/(?=.*[A-Z])/.test(password)){
            setError('please add at least one uppercase')
            return;
        }
        else if(!/(?=.*[0-9].*[0-9])/.test(password)){
            setError('please add at last two number ')
            return;
        }
        else if(password.length < 6){
            setError('password at last 6 charcters')
            return;
        }

        createUserWithEmailAndPassword(auth,email,password)
        .then(result=>{
            const loggedUser = result.user
            console.log(loggedUser);
            setError('')
            e.target.reset('')
            setSuccess('User Has created Successfully ');
            sendVerifactionEmail(result.user)
            updateUserData(result.user, name)
        })
        .catch(error =>{
            console.error(error.message);
            setError(error.message)
        })
    }

    const sendVerifactionEmail = (user)=>{
        sendEmailVerification(user)
        .then(result =>{
            console.log(result);
            alert('please verified your email')
        })
    }

    const updateUserData = (user, name) =>{
        updateProfile(user, {
            displayName: name
        })
        .then(()=>{
            console.log('user name updated ');
        })
        .catch(error=>{
            console.log(error);
            setError(error.message)
        })
    }
    const handleEmailChange = (e) => {
        console.log(e.target.value);
        // setEmail(e.target.value)
    }
    const handlePasswordBlur = (e) => {
        console.log(e.target.value);

    }
    return (
        <div className='w-50 mx-auto '>
            <h3>Please Register</h3>
            <form onSubmit={handleSubmit}>
                <input  className='w-200 mb-4  rounded'type='text' id="name" name='name' placeholder='Your Name' required></input>
                <br />
                <input  className='w-200 mb-4  rounded' onChange={handleEmailChange} type='email' id="email" name='email' placeholder='Your Email' required></input>
                <br />
                <input className='w-20 mb-4 rounded ' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your password'required  />
                <br />
                <input  className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>already have an account? please <Link to='/login'>Login</Link> </small></p>
            <p>{error}</p>
            <p>{success}</p>
        </div>
    );
};

export default Register;