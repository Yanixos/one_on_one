import React, { Component } from 'react';
import { withRouter } from 'react-router';

class RegisterForm extends Component
{

    render()
    {
        const
        {
            state:          // le formulaire d'inscription contient :
            {
                displayName,
                email,
                password,
            },               // les events handlers sont  :
            onNameUpdate,
            onEmailUpdate,
            onPasswordUpdate,
            onSubmit,
            history,
        } = this.props;

        const ID = 'registerForm';

        return (
            <div>
                <h2> Register </h2>

                <div>
                    <input
                        type="text"
                        onChange={ e => onNameUpdate(e.target.value) }
                        value={ displayName }
                        placeholder="Name" />
                </div>

                <div>
                    <input
                        type="email"
                        onChange={ e => onEmailUpdate(ID, e.target.value) }
                        value={ email }
                        placeholder="Email" />
                </div>

                <div>
                    <input
                        type="password"
                        onChange={ e => onPasswordUpdate(ID, e.target.value) }
                        value={ password }
                        placeholder="Password" />
                </div>

                <div>
                    <button type="button" onClick={ () =>
                    {
                        onSubmit();
                        history.push('/app/user/profile');
                    }}> Submit </button>
                </div>

            </div>
        );
    }
}

const RegisterFormWithRouter = withRouter(RegisterForm);
export default RegisterFormWithRouter;
