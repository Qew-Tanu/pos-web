const config = {
    // api_path: 'http://localhost:8888',
    api_path: 'https://api-my-pos-5b13b766f972.herokuapp.com',
    token_name: 'pos_token',
    headers: () => {
        return {
            headers: {
                'Authorization': ' Bearer ' + localStorage.getItem('pos_token')
            }
        }
    }
}

export default config