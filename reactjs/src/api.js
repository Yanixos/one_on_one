const API = jwt_token => {
    const ServerUrl = 'http://localhost:3000';
    const defaultOptions =
    {
        headers:                // le header de la requete à envoyer au serveur
        {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${jwt_token}`,
        },
    };

    return {
        get({ endpoint, options = {}  })
        {
            return fetch(                       // envoyer une get requete à l'end-point correspondant et recuperer la reponse
                            `${ServerUrl}/${endpoint}`,
                             Object.assign({}, defaultOptions, options),
                        ).then(data => data.json());
        },
        post({ endpoint, options = {}, body = '' }) // envoyer une POST requete à l'end-point correspondant et recuperer la reponse
        {
            return fetch(
                `${ServerUrl}/${endpoint}`,
                 Object.assign(
                 {
                    method: 'POST',
                    body: JSON.stringify(body),
                }, defaultOptions, options),
            ).then(data => data.json());
        },
    };
};

export default API;
