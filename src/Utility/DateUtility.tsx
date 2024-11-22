
const DateUtility = {
  // getDayNames(locale = 'en', format = 'long') {
  //   const formatter = new Intl.DateTimeFormat(locale, options);
  //   const days = [1, 2, 3, 4, 5, 6, 7].map(day => {
  //     const dd = day < 10 ? `0${day}` : day;
  //     return new Date(`2017-01-${dd}T00:00:00+00:00`);
  //   });
  //   return days.map(date => formatter.format(date));
  // },
  // getMonthNames(locale = 'en', format = 'long') {
  //   const formatter = new Intl.DateTimeFormat(locale, options);
  //   const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
  //     const mm = month < 10 ? `0${month}` : month;
  //     return new Date(`2017-${mm}-01T00:00:00+00:00`);
  //   });
  //   return months.map(date => formatter.format(date));
  // },



  getDayNames(locale: string = 'en-us', weekdayFormat: 'long' | 'short' | 'narrow' = 'long') {
    // Explicitly define the options with the correct type
    const options: Intl.DateTimeFormatOptions = {
      weekday: weekdayFormat,
    };

    // Pass options to the formatter
    const formatter = new Intl.DateTimeFormat(locale, options);

    const days = [2, 3, 4, 5, 6, 7, 1].map(day => {
      const dd = day < 10 ? `0${day}` : day;
      return new Date(`2017-01-${dd}T00:00:00+00:00`);
    });

    return days.map(date => formatter.format(date));
  },
  getMonthNames(locale: string = 'en', monthFormat: 'long' | 'short' | 'narrow' = 'long') {
    // Define the options with the correct type
    const options: Intl.DateTimeFormatOptions = {
      month: monthFormat,
    };

    // Create the formatter with the provided locale and options
    const formatter = new Intl.DateTimeFormat(locale, options);

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
      const mm = month < 10 ? `0${month}` : month;
      return new Date(`2017-${mm}-02T00:00:00+00:00`);
    });
    return months.map(date => formatter.format(date));
  },


  getResources(){
    return {
      days: {
        long: this.getDayNames(),
        short: this.getDayNames('en', 'short')
      },
      months: {
        long: this.getMonthNames(),
        short: this.getMonthNames('en', 'short')
      }
    }
  }
}

export default DateUtility;