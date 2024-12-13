import { useNavigate } from 'react-router-dom';
const transactionURL = window.location.protocol + '';
const DBAdapter = (setWorking) => {
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
        if (setWorking) {
            setWorking(false);
        }
        // Navigate to a fallback route
        navigate('/login');
    };
    const sendPayload = async ({ transaction, body, params = [], errorString, useWorking = true }) => {
        // Declare waitLayerTimeoutId outside the try block to make it accessible in both try and catch
        let waitLayerTimeoutId = null;
        try {
            // Set the wait layer timeout threshold
            const waitTimeout = 500; // ms
            // Start showing the wait layer if the operation takes more than 500ms
            // const showWaitLayer = new Promise<void>((resolve) => {
            waitLayerTimeoutId = setTimeout(() => {
                if (setWorking) {
                    console.log('should have setworking = true');
                    setWorking(true); // Show the wait layer
                }
            }, waitTimeout);
            // Construct query string from params array
            const urlWithParams = params.reduce((acc, param, index) => {
                const key = Object.keys(param)[0];
                const value = param[key];
                if (value !== undefined) {
                    const separator = index === 0 ? '?' : '&';
                    return `${acc}${separator}${key}=${encodeURIComponent(value)}`;
                }
                return acc; // Skip if value is undefined
            }, `${transaction}.php`);
            // Set up request options
            const options = {
                method: body ? 'POST' : 'GET',
                credentials: 'include', // Include cookies in the request
            };
            if (body) {
                options.body = body; // Add body if it's provided
            }
            // First, await the timeout to potentially show the wait layer
            //await showWaitLayer;
            // Make the request and store the response
            const response = await fetch(`${transactionURL}/${urlWithParams}`, options);
            // Ensure response.ok is checked for valid HTTP responses
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            // Parse and return the response data
            const data = await response.json();
            // Clear the timeout and hide the wait layer
            if (waitLayerTimeoutId !== null) {
                clearTimeout(waitLayerTimeoutId); // Safely clear the timeout
            }
            if (useWorking && setWorking) {
                setWorking(false); // Hide the wait layer
            }
            return data;
        }
        catch (error) {
            // Clear timeout and hide the wait layer if error occurs
            if (waitLayerTimeoutId !== null) {
                clearTimeout(waitLayerTimeoutId); // Safely clear the timeout
            }
            if (useWorking && setWorking) {
                setWorking(false); // Hide the wait layer
            }
            errored(error, errorString); // Handle the error
            throw error; // Optionally re-throw the error for further handling
        }
    };
    // Logout
    const logout = async () => {
        const transaction = 'logout';
        const data = await sendPayload({
            transaction,
            errorString: 'fetching data',
            useWorking: false
        });
        return data;
    };
    const checkForCookie = async () => {
        const transaction = 'authenticateuser';
        return sendPayload({
            transaction,
            errorString: 'Checking authentication',
            useWorking: false
        });
    };
    const authenticateUser = async (username, password) => {
        const transaction = 'authenticateuser';
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
    const fetchData = async (table, orderBy, useWorking = true) => {
        const transaction = 'fetch';
        const params = [
            { tablename: table },
            { orderby: orderBy }
        ];
        const data = await sendPayload({
            transaction,
            params,
            errorString: 'fetching data',
            useWorking
        });
        return data;
    };
    const fetchMonthDates = async (seed, medication, useWorking = true) => {
        const transaction = 'fetchmonthdates';
        const params = [
            { seed_date: seed },
            { medication }
        ];
        const data = await sendPayload({
            transaction,
            params,
            errorString: 'fetching month dates',
            useWorking
        });
        return data;
    };
    const markDate = async (medication, date, marked, useWorking = true) => {
        const transaction = 'markdate';
        const params = [
            { medication },
            { date },
            { marked: marked.toString() }
        ];
        const data = await sendPayload({
            transaction,
            params,
            errorString: 'Marking date',
            useWorking
        });
        return data;
    };
    return {
        logout,
        fetchData,
        checkForCookie,
        authenticateUser,
        markDate,
        fetchMonthDates
    };
};
export default DBAdapter;
