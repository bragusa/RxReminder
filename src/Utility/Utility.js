import strings from '../Resources/Strings'; 

const Utility = {
  replaceVariables(string, replacements) {
    if(replacements === null || replacements === undefined){
      return string
    }
    if(!replacements.forEach){
      replacements = [replacements];
    }
    replacements.forEach((replacement, replacementIndex)=>{
      string = string.replace(`{${replacementIndex}}`, replacement);
    })
    return string;
  },
  buildString(stringId, replacements=[]) {
    let string = strings[stringId];
    if(!string){
      console.error('No string found for '+ stringId);
      return `#${string}`;
    }
    return this.replaceVariables(string, replacements);
  },
  convertToCSV(download){
    const table = document.querySelector(download.selector);
    if(!table){
      console.error(`could not find table with selector '${download.selector}'.`)
      return;
    }
    // Variable to store the final csv data
    let csv_data = [];
  
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
  
        const cols = rows[i].querySelectorAll('td,th');

        let csvrow = [];
        for (let colIndex = 0; colIndex < cols.length; colIndex++) {

            const column = cols[colIndex]
            let pushed = false;
            if(column.classList.contains('teamCalendar--no-download')){
              continue;
            }
            if(!column.firstElementChild){
              csvrow.push(column.innerHTML);
              pushed = true;
            }
            if(!pushed){
              const subElements = column.querySelectorAll(column.getAttribute('data-data-selector'));
              let subString = '';
              if(subElements.length>0){
                Array.from(subElements).forEach((sub)=>{
                  if(!sub.classList.contains('.teamCalendar-no-print')){
                    subString += (subString.length>0?'-':'')+sub.innerHTML;
                  }
                })
                csvrow.push(subString);
                pushed = true;
              }
            }
            if(!pushed){
              console.log(column.innerHTML);
            }
        }
  
        csv_data.push(csvrow.join(","));
    }
    
    csv_data = csv_data.join('\n');
  
    return csv_data;
  },
  downloadCSVFile(download){
    const csv_data = this.convertToCSV(download);
    let name = download.name;
    // Create CSV file object and feed our
    // csv_data into it
    let CSVFile = new Blob([csv_data], { type: "text/csv" });
  
    // Create to temporary link to initiate
    // download process
    let tempLink = document.createElement('a');
  
    name=`TeamCalendar_${name}`;
    
    // Download csv file
    tempLink.download = `${name}.csv`;
    let url = window.URL.createObjectURL(CSVFile);
    tempLink.href = url;
  
    // Inject a hidden link
    tempLink.style.display = "none";
    document.body.appendChild(tempLink);
  
    // Click the link to trigger download 
    tempLink.click();
    document.body.removeChild(tempLink);
  }
}

export default Utility;