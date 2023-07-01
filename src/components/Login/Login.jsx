import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import app from "../../../firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app)

const Login = () => {

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const emailRef = useRef();

    const handleLogin = (e) => {
        e.preventDefault()
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);
        setError('')
        setSuccess('')
        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setError('please ad two uppercase in your password ')
            return;
        }
        else if (!/(?=.*[!@#$&*])/.test(password)) {
            setError('please add special character your password')
            return;
        }
        else if (password.length < 6) {
            setError('password must be six character long')
            return;
        }

        signInWithEmailAndPassword(auth,email,password)
        .then(result =>{
            const loggedUser = result.user;
            console.log(loggedUser);
            setSuccess('user login successful')
            setError('')
        })

        .then(error=>{
            setError(error.message)
            console.error(error.message)
        })
    }

    const handleResetPassword = (e) =>{
        const email = emailRef.current.value;
        if (!email) {
            alert('please provide your email reset to  ')
        }
        sendPasswordResetEmail(auth, email)
        .then( ()=>{
            alert('please check your email')
        })
        .catch(error =>{
            console.log(error);
            setError(error.message)
        })

    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">email:</label>
                    <input
                        type="email"
                        className="form-control"
                        ref={emailRef}
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
           <p><small>Forget password? please <button  onClick={handleResetPassword} className="btn btn-link">Reset password</button></small></p>
            <p><small>new to this website? please <Link to='/register'>register</Link> </small></p>
            <p className="text-danger">{error}</p>
            <p className="text-success">{success}</p>
        </div>
    );
};

export default Login;