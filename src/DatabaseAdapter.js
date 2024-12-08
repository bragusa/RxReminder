import { useNavigate } from 'react-router-dom';
const transactionURL = window.location.protocol + '//southshoreweb.com/rxreminder/data';
const DBAdapter = () => {
    const navigate = useNavigate(); // Hook for navigation
    const errored = (error, context) => {
        if (error instanceof Error) {
            // If the error is an instance of Error, use its message
            console.error(`Error ${context}:`, error.message);
        }
        else {
            // Handle other types of errors gracefully
            console.error(`Unknown error in ${context}:`, error);
        }
        // Navigate to a fallback route
        navigate('/login');
    };
    const sendPayload = async ({ transaction, body, params = [], errorString }) => {
        try {
            // Construct query string from params array
            const urlWithParams = params.reduce((acc, param, index) => {
                const key = Object.keys(param)[0];
                const value = param[key];
                if (value !== undefined) {
                    const separator = index === 0 ? '?' : '&';
                    return `${acc}${separator}${key}=${encodeURIComponent(value)}`;
                }
                return acc; // Skip if value is undefined
            }, transaction);
            // Set up request options
            const options = {
                method: body ? 'POST' : 'GET',
                credentials: 'include', // Include cookies in the request
            };
            if (body) {
                options.body = body; // Add body if it's provided
            }
            // Make the request
            const response = await fetch(`${transactionURL}/${urlWithParams}`, options);
            // Check for errors in the response
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            // Parse and return the response data
            const data = await response.json();
            return data;
        }
        catch (error) {
            errored(error, errorString);
            // if (errorString) {
            //   console.error(`${errorString}:`, error); // Log with custom error string
            // }
            // throw error; // Re-throw the error for further handling
        }
    };
    // Logout
    const logout = async () => {
        const transaction = 'logout.php';
        const data = await sendPayload({
            transaction,
            errorString: 'fetching data',
        });
        return data;
    };
    const authenticateUser = async (username, password) => {
        const transaction = 'authenticateuser.php';
        // Create the FormData
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await sendPayload({
            transaction,
            body: formData,
            errorString: 'authenticating user'
        });
        return response;
    };
    const fetchData = async (table, orderBy) => {
        const transaction = 'fetch.php';
        const params = [
            { tablename: table },
            { orderby: orderBy }
        ];
        const data = await sendPayload({
            transaction,
            params,
            errorString: 'fetching data',
        });
        return data;
    };
    const checkForCookie = async () => {
        const transaction = 'authenticateuser.php';
        return sendPayload({
            transaction,
            errorString: 'Checking authentication'
        });
    };
    const markDate = async (medication, date, marked) => {
        const transaction = 'markdate.php';
        const params = [
            { medication },
            { date },
            { marked: marked.toString() }
        ];
        const data = await sendPayload({
            transaction,
            params,
            errorString: 'Marking date'
        });
        return data;
    };
    return {
        logout,
        fetchData,
        checkForCookie,
        authenticateUser,
        markDate
    };
};
export default DBAdapter;
