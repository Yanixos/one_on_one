import React, { Component } from 'react';

class LoginForm extends Component
{
    render()
    {

        const
        {
            state:               // le formulaire de login contient :
            {
                email,
                password,
            },
            onEmailUpdate,      // les events handlers sont  :
            onPasswordUpdate,
            onSubmit,
        } = this.props;

        const ID = 'loginForm'; 

        return (
            <div>
                <h2> Login </h2>

                <div>
                    <input
                        type="email"
                        onChange={ e => onEmailUpdate( ID , e.target.value) }
                        value={ email }
                        placeholder="mail" />
                </div>

                <div>
                    <input
                        type="password"
                        onChange={ e => onPasswordUpdate( ID , e.target.value) }
                        value={ password }
                        placeholder="password" />
                </div>
                <div>
                    <button type="button" onClick={ () => {
                        onSubmit();
                    }}>Submit</button>
                </div>

            </div>
        );
    }
}

export default LoginForm;
