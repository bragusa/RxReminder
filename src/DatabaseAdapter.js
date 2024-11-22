import DBTransactions from './DatabaseTransactions';
const transactions = new DBTransactions();
const transactionURL = window.location.protocol + '//southshoreweb.com/rxreminder/data';
class DBAdapter {
    // async addMedication(username: string, medication: string){
    //   const dataURL = `${transactionURL}addmedication&username=${username}&medication=${medication}`;
    //   const response = await fetch(dataURL);
    //   const json = await response.json();
    //   return json;
    // }
    // async addUser(username: string, name: string){
    //   const dataURL = `${transactionURL}adduser&username=${username}&name=${name}`;
    //   const response = await fetch(dataURL);
    //   const json = await response.json();
    //   return json;
    // }
    async fetchData(userName, password, tableName, orderBy) {
        const response = await transactions.fetchData(userName, password, tableName, orderBy);
        return response;
    }
    // async markDate(username: string, password: string, medication: string, date: string, marked: number): Promise<any[]>{
    //   const response = await transactions.markDate(username, password, medication, date, marked);
    //   return response;
    // }
    //   async markDate(username: string, password: string, medication: string, date: string, marked: number){
    //     const url = `${transactionURL}/markdate.php?username=${username}&password=${password}&medication=${medication}&date=${date}&marked=${marked}`;
    //     try {
    //         const response = await fetch(url);
    //         try{
    //           const data = await response.json();
    //           return data;
    //         }
    //         catch(error){
    //           console.error('Error parsing JSON:', error);
    //         }
    //     } catch (error) {
    //         console.error('Error during fetch:', error);
    //         throw error; // Re-throw the error for the caller to handle if needed
    //     }
    // //    const response = await transactions.markDate(username, password, medication, date, marked);
    // //    return response;
    //   }
    // }
    async markDate(username, password, medication, date, marked) {
        const url = `${transactionURL}/markdate.php?username=${username}&password=${password}&medication=${medication}&date=${date}&marked=${marked}`;
        try {
            const response = await fetch(url);
            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            try {
                // Attempt to parse JSON
                const data = await response.json();
                return data;
            }
            catch (jsonError) {
                // Handle JSON parsing errors
                console.error('Error parsing JSON response:', jsonError);
                throw new Error('Failed to parse server response.');
            }
        }
        catch (networkError) {
            // Handle fetch-related errors (e.g., network issues)
            console.error('Error during fetch:', networkError);
            throw new Error('Failed to fetch data. Please check your connection or server status.');
        }
    }
}
export default DBAdapter;
