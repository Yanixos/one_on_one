import React, { Component } from 'react';

class UserProfile extends Component {       // page de profile de chaque user
    constructor(props)
    {
        super(props);
        this.state =
        {
            chatInputText: '',        // initialiser la boite de messagerie
        };

        this.onUpdateInput = e =>
        {
            this.setState({
                chatInputText: e.target.value,  // load le message a envoyé
            });
        };

        this.sendMsg = e =>
        {
            e.preventDefault();
            props.onSend(this.state.chatInputText);   // envoyer le msg
            this.setState(
            {
                chatInputText: '',
            });
        };
    }

    componentDidMount()
    {
        const { user, match, loadUser } = this.props;
        if (match && match.params.id)               // load les autres utilisateurs qui match avec l'utilisateur actuelle
        {
            loadUser({ id: match.params.id });
        }
    }

    render()
    {
        const
        {
            user,
            onLike,
            onDislike,
            messages = [],
        } = this.props;

        const { chatInputText } = this.state;

        if (user === null || user === false) {      // en cas ou y a pas d'utilisateur qui match
            return (
                <div>
                    <h2>no available users...</h2>
                </div>
            );
        }

        return (
            <div>
                <h2>Profile</h2>

                <span>Go one-on-one with { user.displayName } ;) </span>

                <div>

                    <button onClick={ () => onLike(user._id) }>
                        Like
                    </button>
                    <button onClick={ () => onDislike(user._id) }>
                        Dislike
                    </button>

                </div>

                <div>

                    <h3>Chat</h3>

                    <div>
                        {
                            messages.map((msg, index) => (
                                <div key={ index }>
                                    <b>{ msg.sender }: </b>
                                    <span>{ msg.text }</span>
                                </div>
                            ))
                        }
                        <form onSubmit={ this.sendMsg }>
                            <input
                                onChange={ this.onUpdateInput }
                                value={ chatInputText }
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;
