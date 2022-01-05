import axios from 'axios';
import Cookies from 'js-cookie';

class CallAPI {
  getOption = (actionName, params = {}) => {
    const url = params.customUrl ? `${params.customUrl}?ts=${Date.now()}` : `teaching-plan/apis.json?actionName=${actionName}&ts=${Date.now()}`;
    const options = {
      url,
      method: params.customMethod || 'POST',
      type: 'json',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const csrfToken = Cookies.get('csrfToken');
    if (csrfToken) {
      options.headers['x-csrf-token'] = csrfToken;
    }

    return options;
  };

  dispatch = (actionName, params) => {
    const options = this.getOption(actionName, params);

    return new Promise((resolve, reject) => {
      axios(options)
        .then((result) => {
          if (result.status === 200) {
            resolve(result.data);
          } else {
            reject(result.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

const callAPI = new CallAPI();

export default callAPI.dispatch.bind(callAPI);
