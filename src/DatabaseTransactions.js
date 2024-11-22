const transactionURL = window.location.protocol + '//southshoreweb.com/rxreminder/data';
class DatabaseTransactions {
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
    // async fetch(tableName: string, userName: string) {
    //     const dataURL = `${transactionURL}fetch&table=${tableName}&username=${userName}`;
    //     const response = await fetch(dataURL);
    //     const json = await response.json();
    //     return json;
    // }
    async fetchData(userName, password, table, orderBy) {
        const url = `${transactionURL}/fetch.php?tablename=${table}&username=${userName}&password=${password}&orderby=${encodeURIComponent(orderBy)}`;
        return new Promise((resolve, reject) => {
            let data = [];
            fetch(url)
                .then(response => response.json())
                .then(json => {
                data = json;
                resolve(data);
            })
                .catch(error => {
                // Handle the error
                debugger;
                console.error('There was a problem with the fetch operation:', error);
            });
            ;
        });
    }
    async updateMedication(userName, password, name, sort) {
        const url = `${transactionURL}/updatemedication.php?username=${userName}&password=${password}&name=${name}&sort=${sort}`;
        return new Promise((resolve, reject) => {
            let data = [];
            fetch(url)
                .then(response => response.json())
                .then(json => {
                data = json;
                resolve(data);
            })
                .catch(error => {
                // Handle the error
                debugger;
                console.error('There was a problem with the fetch operation:', error);
            });
            ;
        });
    }
    async markDate(userName, password, medication, date, marked) {
        const url = `${transactionURL}/markdate.php?username=${userName}&password=${password}&medication=medication&date=${date}&marked=${marked}`;
        return new Promise((resolve, reject) => {
            let data = [];
            fetch(url)
                .then(response => {
                debugger;
                return response.json();
            })
                .then(json => {
                debugger;
                data = json;
                resolve(data);
            })
                .catch(error => {
                // Handle the error
                debugger;
                console.error('There was a problem with the fetch operation:', error);
            });
            ;
        });
        // const dataURL = `${transactionURL}markdate&username=${username}&medication=${medication}&date=${date}&marked=${marked}`;
        // const response = await fetch(dataURL);
        // const json = await response.json();
        // return json;
    }
}
export default DatabaseTransactions;
