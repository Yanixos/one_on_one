import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import RegisterForm from './RegisterForm.js';
import LoginForm from './LoginForm.js';
import UserProfile from './profile.js';
import PeopleList from './PeopleList.js';
import API from './api.js';
import io from 'socket.io-client';

const Protected = ({ authenticated, children }) => ( // proteger un rep et ses sous-rep par l'authenfication
    authenticated ? children : null
);

class App extends Component
{
    constructor(props) {
        super(props);

        const access_token = window.localStorage.getItem('access_token');       // recuperer le JWT token affecté par le serveur

        this.state =
        {
            access_token,
            currentUser: null,
            user: null,
            people: [],
            loginForm: {
                email: 'yanis@domain.com',
                password: '1',
            },
            registerForm: {
                displayName: 'Alderic',
                email: 'alderic@domain.com',
                password: '12345678',
            },
            messages: [],
        };

        this.api = API(access_token);
    }

    componentDidUpdate()
    {
        const { access_token } = this.state;
        window.localStorage.setItem('access_token', access_token);    // stocker le token dans le serveur
    }

    componentDidMount()
    {
        const { access_token } = this.state;      // recuperer le token
        this.loadCurrentUser();

        const socket = io('http://localhost:3000'); // initialiser la socket client-serveur
        this.socket = socket;

        socket.on('getMsgs', messages =>  // attendre les messages
        {
            this.setState({
                messages,
            });
        });

        socket.on('newChatMsg', msg =>      // une fois un msg est reçu, on l'ajouté a la liste des messages
        {
            this.setState({
                messages: [].concat(this.state.messages, msg),
            });
        });
    }

    sendChatMsg(text)     //envoyer un nouveau msg
    {
        const msg =         // un msg comporte deux champs :
        {
            sender: this.state.currentUser.displayName,
            text,
        };

        this.setState(
        {
            messages: [].concat(this.state.messages, msg), // ajouter le msg a envoyé à la liste des messages
        });

        this.socket.emit('chatMsg', msg); // l'envoie du msg
    }

    onNameUpdate(displayName)                 // l'event handler pour le nom dans le formulaire d'inscription
    {
        const { registerForm } = this.state;
        const updatedForm = Object.assign({}, registerForm, { displayName });
        this.setState(
        {
            registerForm: updatedForm,
        });
    }

    onEmailUpdate(form, email)                  // l'event handler pour l'email dans le formulaire d'inscription
    {
        const oldForm = this.state[form];
        const updatedForm = Object.assign({}, oldForm, { email });
        this.setState({
            [form]: updatedForm,
        });
    }

    onPasswordUpdate(form, password)  // l'event handler pour le mot de passe dans le formulaire d'inscription
    {
        const oldForm = this.state[form];
        const updatedForm = Object.assign({}, oldForm, { password });
        this.setState({
            [form]: updatedForm,
        });
    }

    onSignUpSubmit() {            //  l'event handler pour valider le formulaire d'inscription
        const { registerForm } = this.state;
        this.api.post(
          {
            endpoint: 'auth/register',
            body:
            {
                email: registerForm.email,
                displayName: registerForm.displayName,
                password: registerForm.password,
            },
        })                                          // une fois l'inscription a été faite
            .then(({ access_token }) =>
            {
                this.setState(
                {
                    access_token,                 // accorder à l'utilisateur un token
                });

                this.setState(
                {
                    currentUser:                      // mettre à jour l'utilisateur actuelle
                    {
                        displayName: registerForm.displayName,
                        email: registerForm.email,
                    },
                    registerForm:
                    {
                        name: '',
                        email: '',
                        password: '',
                    },
                });
                this.api = API(access_token);
                this.loadCurrentUser();                 // chargé les informations a propos d'utilisateur
            })
            .catch(err => console.error(err));    // garder trace des erruers
    }

    onSignInSubmit()        // envoyer le formulaire de login
    {
        const
        {
            loginForm:
            {
                email,
                password,
            },
        } = this.state;

        this.api.post(          // posti la requete en mettant l'email et pw dans le corp
        {
            endpoint: 'auth/login',
            body:
            {
                email,
                password,
            }
        })
        .then(({ access_token }) =>
        {
            this.setState({
                access_token,       // une fois le login a été bien fait, on accorde à l'utilisateur un JWT token
            });
            this.api = API(access_token);
            this.loadCurrentUser();       // chargé les informations de l'utilisateur
        })
        .catch(err => console.error(err));
    }

    loadCurrentUser()           // fonction qui charge les informations a propos de l'utilisateur
    {
        this.loadUser({ id: 'me' });  // appel a une fonction auxiliaire
    }

    loadUser({ id })
    {
        const userField = id === 'me' ? 'currentUser' : 'user';
        this.setState({
            [userField]: false,
        });
        this.api
            .get({ endpoint: `api/users/${id}` })         // envoyer une requete pour recuperer les info a propos d'utilisateur
            .then(({ _id, email, displayName }) =>
            {
                this.setState({
                    [userField]:
                    {
                        _id,
                        email,
                        displayName,
                    },
                });
            });
    }

    loadPeople()        // chargé les autres utilisateurs
    {
        this.api.get(
        {
            endpoint: 'api/users',
        }).then(({ users }) =>
        {
            this.setState({ people: users });
        });
    }

    vote(LikeOrDislike, id)       //envoyer une requete pour Liker ou disliker un autre utilisateur
    {
        this.api.get(
          {
            endpoint: `api/users/${ id }/vote/${ LikeOrDislike }`,
        });
    }

    Liked(id)                   // event handler de liker qlq'un
    {
        this.vote('like', id);
    }

    Disliked(id)              // event handler de disliker qlq'un
    {
        this.vote('dislike', id);
    }

    render()
    {
        const
        {
            currentUser,
            user,
            registerForm,
            loginForm,
            people,
        } = this.state;

        return (     // page d'acceuil, ce n'est pas possible de commenter dans ce qui suit, car render doit retourner un seul DIV et ça n'accepte pas de commentaire dedans
            <Router>
                <div>
                    <ul>
                        <li><Link to="/app/login"> Login </Link></li>

                        <li><Link to="/app/register"> Register </Link></li>

                        <Protected authenticated={ !!currentUser }>
                            <li><Link to="/app/user/me/profile">{ currentUser && currentUser.displayName }</Link></li>
                        </Protected>

                        <Protected authenticated={ !!currentUser }>
                            <li><Link to="/app/people">People</Link></li>
                        </Protected>

                    </ul>

                    <div>

                        <Route path="/app/register" render={ () => (
                            <RegisterForm
                                state={ registerForm }
                                onNameUpdate={ this.onNameUpdate.bind(this) }
                                onEmailUpdate={ this.onEmailUpdate.bind(this) }
                                onPasswordUpdate={ this.onPasswordUpdate.bind(this) }
                                onSubmit={ this.onSignUpSubmit.bind(this) }
                            />
                        )}/>

                        <Route path="/app/login" render={ () => (
                            <LoginForm
                                state={ loginForm }
                                onEmailUpdate={ this.onEmailUpdate.bind(this) }
                                onPasswordUpdate={ this.onPasswordUpdate.bind(this) }
                                onSubmit={ this.onSignInSubmit.bind(this) }
                            />
                        )}/>

                        <Route path="/app/people" render={ () => (
                            <PeopleList
                                people={ people }
                                loadPeople={ this.loadPeople.bind(this) }
                                />
                        )} />

                        <Switch>

                            <Route path="/app/user/me/profile" render={ () => (
                                <UserProfile
                                    user={ currentUser }
                                    messages={ this.state.messages }
                                    onSend={ this.sendChatMsg.bind(this) }
                                />
                            )} />

                            <Route path="/app/user/:id/profile" render={ ({ match }) => (
                                <UserProfile
                                    user={ user }
                                    messages={ this.state.messages }
                                    match={ match }
                                    loadUser={ this.loadUser.bind(this) }
                                    onLike={ this.Liked.bind(this) }
                                    onDislike={ this.Disliked.bind(this) }
                                    onSend={ this.sendChatMsg.bind(this) }
                                    />

                            )} />

                        </Switch>

                    </div>

                </div>

            </Router>
        );
    }
}

const container = document.getElementById('root');
render( <App />, container );
